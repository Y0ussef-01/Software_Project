import React from 'react';
import { FileSpreadsheet, CheckCircle, Minus } from 'lucide-react';

export default function ExcelInstructionsCard() {
  const acceptedNames = ["id", "student_id", "code", "student id", "كود الطالب"];
  const ignoredNames = ["name", "student name", "student_name", "email", "department", "serial", "الاسم"];

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-gray-100 pb-4 mb-4">
        <div className="bg-blue-50 p-2.5 rounded-lg flex-shrink-0">
          <FileSpreadsheet className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            Excel Column Naming Rules
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Please ensure your primary key column is named correctly before uploading.
          </p>
        </div>
      </div>

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Section A: Accepted */}
        <div className="bg-green-50/30 border border-green-100 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">
            Accepted Names (Primary Key)
          </h4>
          <ul className="space-y-3">
            {acceptedNames.map((name, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="font-mono text-sm text-green-700 font-medium">{name}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Section B: Ignored */}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-5">
          <h4 className="text-sm font-semibold text-gray-700 mb-4 border-b border-gray-200 pb-2">
            Ignored Names (Do Not Use for ID)
          </h4>
          <ul className="space-y-3">
            {ignoredNames.map((name, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <Minus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="font-mono text-sm text-gray-500">{name}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
