import React from 'react';

export default function MonthlyReportModal({ isOpen, onClose, summary }) {
  if (!isOpen) return null;

  // Get date range (current month)
  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });
  const year = now.getFullYear();

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md max-h-full overflow-y-auto rounded-[40px] bg-[#9ca3af] p-6 md:p-8 shadow-2xl border border-white/10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Monthly Report</h2>
        
        <div className="bg-gray-500/30 rounded-[30px] p-6 md:p-8 mb-8 text-white space-y-4">
          <p className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest mb-6">
            {monthName} {year}
          </p>
          
          <div className="space-y-3 font-medium text-sm md:text-base">
            <div className="flex justify-between">
              <span>Budget:</span>
              <span className="font-bold">₱{summary.budget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="font-bold text-green-300">₱{summary.income.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Expense:</span>
              <span className="font-bold text-red-300">₱{summary.expense.toLocaleString()}</span>
            </div>
            
            <div className="pt-4 border-t border-white/10 mt-4">
              <div className="flex justify-between text-base md:text-lg">
                <span className="font-bold">Total Savings:</span>
                <span className="font-black">₱{summary.savings.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-white text-gray-800 rounded-2xl font-black shadow-lg hover:bg-gray-100 transition-transform active:scale-95 text-sm md:text-base"
        >
          BACK
        </button>
      </div>
    </div>
  );
}