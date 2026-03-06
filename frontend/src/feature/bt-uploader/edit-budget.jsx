import React, { useState, useEffect } from 'react';

export default function EditBudgetModal({ isOpen, onClose, onConfirm, currentBudget }) {
  const [budgetAmount, setBudgetAmount] = useState("");
  const [cycleDuration, setCycleDuration] = useState("");

  // Pre-fill with current values when modal opens
  useEffect(() => {
    if (isOpen && currentBudget) {
      setBudgetAmount(currentBudget.toString());
    }
  }, [isOpen, currentBudget]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const amount = parseFloat(budgetAmount) || currentBudget || 0;
    const duration = cycleDuration ? parseInt(cycleDuration) : undefined;
    
    onConfirm(amount, duration);
    
    // Reset form
    setBudgetAmount("");
    setCycleDuration("");
  };

  const handleCancel = () => {
    setBudgetAmount("");
    setCycleDuration("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[420px] rounded-[40px] bg-[#cbcbcb] p-8 md:p-10 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Edit Budget</h2>
        <p className="text-sm font-bold text-gray-700 mb-6">
          Update your budget amount or cycle duration
        </p>
        
        {/* Budget Amount Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
            Budget Amount
          </label>
          <input
            type="number"
            value={budgetAmount} 
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-[#e1e1e1] text-lg md:text-xl font-black text-gray-800 shadow-inner outline-none"
            placeholder="0.00"
          />
        </div>

        {/* Cycle Duration Input */}
        <div className="mb-8">
          <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
            Cycle Duration (Optional)
          </label>
          <select
            value={cycleDuration}
            onChange={(e) => setCycleDuration(e.target.value)}
            className="w-full h-14 px-6 rounded-2xl bg-[#e1e1e1] text-lg font-bold text-gray-800 shadow-inner outline-none"
          >
            <option value="">Keep current duration</option>
            <option value="7">Weekly (7 days)</option>
            <option value="14">Bi-weekly (14 days)</option>
            <option value="30">Monthly (30 days)</option>
            <option value="60">Bi-monthly (60 days)</option>
            <option value="90">Quarterly (90 days)</option>
          </select>
          <p className="text-xs text-gray-600 mt-2 px-2">
            Change this to adjust your budget cycle length
          </p>
        </div>

        <div className="flex justify-center gap-4">
          <button 
            onClick={handleCancel} 
            className="flex-1 py-3 rounded-2xl bg-[#e1e1e1] text-sm md:text-base font-black shadow-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-1 py-3 rounded-2xl bg-[#e1e1e1] text-sm md:text-base font-black shadow-md hover:bg-gray-200 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}