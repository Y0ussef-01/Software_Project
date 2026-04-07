const fs = require('fs');
const { parse } = require('@babel/parser');
const glob = require('glob');

const srcDir = '/home/ahmed-amria/Downloads/Software_Project';

const files = glob.sync(`${srcDir}/**/*.{js,jsx,json}`, {
  ignore: ['**/node_modules/**', '**/.git/**', '**/.gemini/**']
});

let totalCommentsRemoved = 0;

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  let ast;
  
  if (file.endsWith('.json')) {
    const beforeLength = code.length;
    code = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    if (code.length !== beforeLength) {
       fs.writeFileSync(file, code, 'utf8');
    }
    continue;
  }

  try {
    ast = parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'], 
      errorRecovery: true
    });
  } catch (e) {
    console.warn(`Warning parsing ${file}: ${e.message}. Using fallback regex...`);
    // Fallback naive regex if Babel parse fails
    const beforeLength = code.length;
    let safeCode = code.replace(/\/\/\s*eslint-disable[\s\S]*?$/gm, match => match.replace(/\//g, '@@SLASH@@'));
    safeCode = safeCode.replace(/\/\/\s*@ts-ignore[\s\S]*?$/gm, match => match.replace(/\//g, '@@SLASH@@'));
    
    safeCode = safeCode.replace(/(?<!:)\/\/.*$/gm, '');
    safeCode = safeCode.replace(/\/\*[\s\S]*?\*\//g, '');
    
    safeCode = safeCode.replace(/@@SLASH@@/g, '/');
    if (safeCode.length !== beforeLength) {
       fs.writeFileSync(file, safeCode, 'utf8');
    }
    continue;
  }

  if (!ast.comments || ast.comments.length === 0) continue;

  const commentsToRemove = ast.comments.filter(c => {
    const val = c.value.trim().toLowerCase();
    if (val.startsWith('eslint-')) return false;
    if (val.startsWith('@ts-')) return false;
    if (val.startsWith('prettier-')) return false;
    if (val.includes('no-console')) return false;
    if (c.value.trim().startsWith('!')) return false;
    return true;
  });

  commentsToRemove.sort((a, b) => b.start - a.start);

  for (const c of commentsToRemove) {
    let start = c.start;
    let end = c.end;

    if (c.type === 'CommentLine') {
      let i = start - 1;
      let onlySpacesBefore = true;
      while (i >= 0 && code[i] !== '\n') {
        if (code[i] !== ' ' && code[i] !== '\t') {
          onlySpacesBefore = false;
          break;
        }
        i--;
      }

      if (onlySpacesBefore) {
        start = i + 1; 
        if (code[end] === '\n') {
          end = end + 1; 
        } else if (code[end] === '\r' && code[end+1] === '\n') {
          end = end + 2; 
        }
      }
    } else if (c.type === 'CommentBlock') {
        let j = start - 1;
        while (j >= 0 && /\s/.test(code[j])) j--;
        let k = end;
        while (k < code.length && /\s/.test(code[k])) k++;

        if (j >= 0 && code[j] === '{' && k < code.length && code[k] === '}') {
          start = j;
          end = k + 1;
          
          let i = start - 1;
          let onlySpacesBefore = true;
          while (i >= 0 && code[i] !== '\n') {
            if (code[i] !== ' ' && code[i] !== '\t') {
              onlySpacesBefore = false;
              break;
            }
            i--;
          }
          if (onlySpacesBefore) {
            let q = end;
            let onlySpacesAfter = true;
            while (q < code.length && code[q] !== '\n') {
                if (code[q] !== ' ' && code[q] !== '\t' && code[q] !== '\r') {
                    onlySpacesAfter = false; break;
                }
                q++;
            }
            if (onlySpacesAfter) {
                start = i + 1;
                end = q;
                if (code[end] === '\n') end++;
                else if (code[end] === '\r' && code[end+1] === '\n') end+=2;
            }
          }
        } else {
          let i = start - 1;
          let onlySpacesBefore = true;
          while (i >= 0 && code[i] !== '\n') {
            if (code[i] !== ' ' && code[i] !== '\t') {
              onlySpacesBefore = false;
              break;
            }
            i--;
          }
          if (onlySpacesBefore) {
             let q = end;
             let onlySpacesAfter = true;
             while (q < code.length && code[q] !== '\n') {
                 if (code[q] !== ' ' && code[q] !== '\t' && code[q] !== '\r') {
                     onlySpacesAfter = false; break;
                 }
                 q++;
             }
             if (onlySpacesAfter) {
                 start = i + 1;
                 end = q;
                 if (code[end] === '\n') end++;
             }
          }
        }
    }

    code = code.slice(0, start) + code.slice(end);
    totalCommentsRemoved++;
  }

  // Also remove HTML comments (e.g., <!-- comment -->) manually via regex
  code = code.replace(/<!--[\s\S]*?-->/g, '');

  fs.writeFileSync(file, code, 'utf8');
}

console.log(`Cleaned comments. Total AST comments removed: ${totalCommentsRemoved}`);
