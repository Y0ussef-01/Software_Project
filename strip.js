const fs = require('fs');
const path = require('path');

const DIRECTIVE_REGEX = /eslint-disable|@ts-ignore|jscs:|jshint|globals? /;

function stripCommentsFromFile(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  
  // A simplified but robust approach for our React project:
  // 1. Remove exactly {/* ... */} style comments 
  // 2. Remove standard /* ... */ (but if it contains a directive, keep it)
  // 3. Remove // ... (but if it contains a directive or is part of a URL, be careful)
  
  // We will instead use a regex that handles URLs carefully if we can, 
  // But a simple regex for finding comments:
  // Block comments: /\/\*[\s\S]*?\*\//g
  // Line comments: /\/\/.*/g
  // We must skip strings. 
  
  // Using a custom regex to prevent stripping strings is complex.
  // We will run this script carefully using a simple state machine to avoid strings.
  
  let out = "";
  let i = 0;
  let inString = false;
  let stringChar = '';
  let inRegex = false;
  
  while (i < code.length) {
    const c = code[i];
    const nextC = code[i+1];
    
    // Handle string toggles
    if ((c === '"' || c === "'" || c === '`') && code[i-1] !== '\\' && !inRegex) {
      if (!inString) {
        inString = true;
        stringChar = c;
      } else if (stringChar === c) {
        inString = false;
      }
      out += c;
      i++;
      continue;
    }
    
    // Simple regex skip (naive but often works in JSX if we avoid `<`)
    if (c === '/' && !inString && code[i-1] !== '\\') {
      if (nextC === '/' && code[i-1] !== ':') { // avoiding http://
        // Line comment
        const nl = code.indexOf('\n', i);
        const commentContent = code.slice(i, nl === -1 ? code.length : nl);
        if (DIRECTIVE_REGEX.test(commentContent)) {
          out += commentContent;
        }
        i = (nl === -1) ? code.length : nl;
        continue;
      }
      
      if (nextC === '*') {
        // Block comment
        const end = code.indexOf('*/', i + 2);
        if (end !== -1) {
          const commentContent = code.slice(i, end + 2);
          if (DIRECTIVE_REGEX.test(commentContent)) {
            out += commentContent;
          }
          i = end + 2;
          continue;
        }
      }
    }
    
    // Quick handle for JSX {/* */}
    if (c === '{' && nextC === '/' && code[i+2] === '*' && !inString) {
      const end = code.indexOf('*/}', i + 3);
      if (end !== -1) {
        const commentContent = code.slice(i, end + 3);
        if (DIRECTIVE_REGEX.test(commentContent)) {
          out += commentContent; 
        }
        i = end + 3;
        continue;
      }
    }
    
    out += c;
    i++;
  }
  
  // Clean up trailing empty lines created by comment removal
  out = out.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  fs.writeFileSync(filePath, out, 'utf8');
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== '.idea') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      try {
        stripCommentsFromFile(fullPath);
      } catch(e) {
        console.error(`Error stripping ${fullPath}`, e);
      }
    }
  }
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error("Please provide a directory");
  process.exit(1);
}

processDirectory(targetDir);
console.log("Stripping comments completed.");
