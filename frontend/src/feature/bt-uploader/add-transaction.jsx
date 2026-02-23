import React, { useState, useEffect } from 'react';

export default function AddTransactionModal({ isOpen, onClose, onConfirm, currentSummary }) {
  const [type, setType] = useState('expense'); 
  
  const initialFormState = { 
    description: '', 
    amount: '', 
    category: '', 
    date: '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  const expenseCategories = [
    "Food & Dining", "Transportation", "Entertainment", "Utilities",
    "Health & Fitness", "Education", "Shopping", "Travel", "Personal Care", "Other"
  ];

  const incomeCategories = [
    "Salary", "Allowance", "Owned Money", "Other"
  ];

  useEffect(() => {
    setFormData(prev => ({ ...prev, category: '' }));
  }, [type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const amt = parseFloat(formData.amount) || 0;
    
    const currentIncome = parseFloat(currentSummary.income) || 0;
    const currentExpense = parseFloat(currentSummary.expense) || 0;
    const currentBudget = parseFloat(currentSummary.budget) || 0;

    let updatedSummary;
    if (type === 'income') {
      const newBudget = currentBudget + amt;
      updatedSummary = {
        ...currentSummary,
        income: currentIncome + amt,
        budget: newBudget,
        savings: newBudget
      };
    } else {
      const newBudget = currentBudget - amt;
      updatedSummary = {
        ...currentSummary,
        expense: currentExpense + amt,
        budget: newBudget,
        savings: newBudget
      };
    }

    const newTx = { 
      name: formData.description, 
      amount: amt, 
      type: type,
      category: formData.category 
    };

    onConfirm(updatedSummary, newTx);
    
    setFormData(initialFormState);
    setType('expense');
  };

  const handleClose = () => {
    setFormData(initialFormState);
    onClose();
  };

  const currentCategories = type === 'expense' ? expenseCategories : incomeCategories;

  return (
    // Added p-4 to the backdrop to ensure the modal doesn't touch the screen edges on mobile
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* 1. Changed w-[450px] to w-full max-w-[450px]
          2. Changed p-10 to p-6 (mobile) and md:p-10 (desktop)
          3. Added overflow-y-auto and max-h-full for small vertical screens
      */}
      <div className="w-full max-w-[450px] max-h-full overflow-y-auto rounded-[30px] bg-[#cbcbcb] p-6 md:p-10 shadow-2xl font-sans">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>

        <div className="flex bg-[#d9d9d9] rounded-xl p-1 mb-8">
          <button 
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              type === 'expense' ? 'bg-[#a3a3a3] text-gray-800' : 'text-gray-500'
            }`}
          >Expense</button>
          <button 
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              type === 'income' ? 'bg-[#a3a3a3] text-gray-800' : 'text-gray-500'
            }`}
          >Income</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Description</label>
            <input 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 text-sm md:text-base" 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Amount</label>
            <input 
              type="number" 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 text-sm md:text-base" 
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Category</label>
            <select 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 font-medium appearance-none text-sm md:text-base"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              {currentCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Date</label>
            <input 
              type="date"
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 uppercase text-xs" 
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})} 
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
          <button 
            onClick={handleClose} 
            className="order-2 sm:order-1 flex-1 py-2.5 bg-[#d9d9d9] text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="order-1 sm:order-2 flex-1 py-2.5 bg-[#f5f5f5] text-gray-800 rounded-xl font-bold shadow-md hover:bg-white transition-colors text-sm md:text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}