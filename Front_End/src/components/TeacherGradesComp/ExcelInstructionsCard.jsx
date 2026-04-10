import React from 'react';
import { Info, CheckCircle, X } from 'lucide-react';

export default function ExcelInstructionsCard() {
  const acceptedNames = ["id", "student_id", "code", "student id", "كود الطالب"];
  const ignoredNames = ["name", "student name", "student_name", "email", "department", "serial", "الاسم"];

  return (
    <div className="max-w-4xl mx-auto border-2 border-blue-950 rounded-xl shadow-md overflow-hidden mb-8 bg-white">
      {/* Solid Header */}
      <div className="bg-blue-950 text-white p-4 flex items-center justify-center gap-2">
        <Info className="w-5 h-5 flex-shrink-0" />
        <h3 className="text-lg font-bold">Excel Sheet Guidelines</h3>
      </div>

      {/* Split Body Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:divide-x-2 divide-gray-200">
        
        {/* Left Half (Accepted Names) */}
        <div className="p-6 bg-white">
          <h4 className="text-blue-950 font-bold mb-4 text-center border-b pb-2">
            Accepted Primary Key Names
          </h4>
          <div className="flex flex-col">
            {acceptedNames.map((name, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 mb-2 bg-blue-50/50 border border-blue-100 rounded-lg text-blue-800 font-mono text-sm font-bold shadow-sm"
              >
                <span>{name}</span>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Right Half (Ignored Columns) */}
        <div className="p-6 bg-slate-50">
          <h4 className="text-slate-700 font-bold mb-4 text-center border-b pb-2">
            Ignored Columns
          </h4>
          <div className="flex flex-col">
            {ignoredNames.map((name, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 mb-2 bg-white border border-gray-200 rounded-lg text-gray-500 font-mono text-sm shadow-sm"
              >
                <span>{name}</span>
                <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
