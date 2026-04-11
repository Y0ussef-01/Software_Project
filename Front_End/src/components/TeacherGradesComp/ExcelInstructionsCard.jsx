import React from 'react';

export default function ExcelInstructionsCard() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '40px 10px' }}>
      
      {/* Mobile-Sized Wrapper with Fixed Dimensions */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', minWidth: '300px', flexShrink: 0 }}>
        
        {/* Glow Background */}
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-[32px] blur-xl opacity-50"></div>
        
        {/* Main Glass Card */}
        <div 
          className="relative bg-slate-900 border border-slate-700 shadow-2xl"
          style={{ borderRadius: '32px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '32px', backdropFilter: 'blur(16px)' }}
        >
          
          <h2 style={{ margin: 0, textAlign: 'center', fontSize: '22px', fontWeight: 'bold', color: '#ffffff' }}>
            ✨ Column Rules
          </h2>
          
          {/* Valid Names Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#67e8f9', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Valid Names
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['id', 'student_id', 'code', 'student id', 'كود الطالب'].map((name) => (
                <span 
                  key={name} 
                  style={{ backgroundColor: 'rgba(6,182,212,0.15)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

          {/* Ignored Columns Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#f472b6', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Ignored Columns
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {['name', 'student name', 'student_name', 'email', 'department', 'serial', 'الاسم'].map((name) => (
                <span 
                  key={name} 
                  style={{ backgroundColor: 'rgba(236,72,153,0.15)', color: '#f472b6', border: '1px solid rgba(236,72,153,0.3)', padding: '8px 16px', borderRadius: '999px', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}
                >
                  {name}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
