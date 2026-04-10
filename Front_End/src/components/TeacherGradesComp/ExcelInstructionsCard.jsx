import React from 'react';
import { FileSpreadsheet, CheckCircle2, X } from 'lucide-react';

export default function ExcelInstructionsCard() {
  const acceptedNames = ["id", "student_id", "code", "student id", "كود الطالب"];
  const ignoredNames = ["name", "student name", "student_name", "email", "department", "serial", "الاسم"];

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center gap-3">
        <FileSpreadsheet className="w-5 h-5 text-slate-500 flex-shrink-0" />
        <h3 className="text-lg font-bold text-slate-800">
          Excel Column Naming Rules
        </h3>
      </div>

      {/* Valid Names Block (Blue Section) */}
      <div className="bg-blue-50/30 p-6 border-b border-slate-200">
        <span className="text-sm font-bold text-blue-900 mb-4 block">
          Accepted Primary Key Names
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {acceptedNames.map((name, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 bg-white border border-blue-200 p-3 rounded-lg shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
              <span className="font-mono text-blue-700 text-sm font-medium">{name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Ignored Names Block (Gray Section) */}
      <div className="bg-slate-50 p-6">
        <span className="text-sm font-bold text-slate-700 mb-4 block">
          Ignored Columns
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {ignoredNames.map((name, idx) => (
            <div 
              key={idx} 
              className="flex items-center gap-3 bg-white border border-slate-200 p-3 rounded-lg shadow-sm opacity-90"
            >
              <X className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-mono text-slate-500 text-sm">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
