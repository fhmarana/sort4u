import React, { useState } from 'react';

export default function EditBudgetModal({ isOpen, onClose, onConfirm }) {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    const amount = parseFloat(inputValue) || 0;
    onConfirm(amount);
    setInputValue(""); 
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[420px] rounded-[40px] bg-[#cbcbcb] p-8 md:p-10 shadow-2xl">
        <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Edit Budget</h2>
        <p className="text-sm font-bold text-gray-700 mb-6">Enter the New Budget Amount</p>
        
        <input
          type="number"
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full h-14 px-6 rounded-2xl bg-[#e1e1e1] text-lg md:text-xl font-black text-gray-800 shadow-inner outline-none mb-8"
          placeholder="0.00"
        />

        <div className="flex justify-center gap-4">
          <button 
            onClick={onClose} 
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