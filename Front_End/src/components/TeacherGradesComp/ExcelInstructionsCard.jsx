import React from 'react';
import { FileSpreadsheet, CheckCircle } from 'lucide-react';

export default function ExcelInstructionsCard() {
  const acceptedNames = ["id", "student_id", "code", "student id", "كود الطالب"];
  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5 mb-6 max-w-4xl">
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

      <div className="bg-green-50/30 border border-green-100 rounded-lg p-5">
        <h4 className="text-sm font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">
          Accepted Names (Primary Key)
        </h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', direction: 'ltr' }}>
          {acceptedNames.map((name, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffffff',
                border: '1px solid #ffffffff',
                padding: '6px 12px',
                borderRadius: '6px'
              }}
            >
              <CheckCircle style={{ width: '16px', height: '16px', color: '#000000ff', flexShrink: 0 }} />
              <span style={{ fontFamily: 'monospace', fontSize: '14px', color: '#000000ff', fontWeight: 500 }}>
                {name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}