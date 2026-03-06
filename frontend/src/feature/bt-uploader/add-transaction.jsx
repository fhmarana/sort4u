import React, { useState, useEffect } from 'react';

export default function AddTransactionModal({ isOpen, onClose, onConfirm, categories = [] }) {
  const [type, setType] = useState('expense'); 
  
  const initialFormState = { 
    description: '', 
    amount: '', 
    category: '', 
    transaction_date: '' 
  };

  const [formData, setFormData] = useState(initialFormState);

  // Filter categories by type
  const currentCategories = categories.filter(cat => cat.type === type);

  // Reset category when type changes
  useEffect(() => {
    setFormData(prev => ({ ...prev, category: '' }));
  }, [type]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Validation
    if (!formData.description.trim()) {
      alert("Please enter a description.");
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    if (!formData.category) {
      alert("Please select a category.");
      return;
    }

    // Prepare data for backend
    const transactionData = {
      description: formData.description.trim(),
      amount: formData.amount,
      type: type,
      category: formData.category, // This is category_id
      transaction_date: formData.transaction_date || undefined
    };

    // Call parent handler
    onConfirm(transactionData);

    // Reset form
    setFormData(initialFormState);
    setType('expense');
  };

  const handleClose = () => {
    setFormData(initialFormState);
    setType('expense');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-[450px] max-h-full overflow-y-auto rounded-[30px] bg-[#cbcbcb] p-6 md:p-10 shadow-2xl font-sans">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Add Transaction</h2>

        {/* Type Toggle */}
        <div className="flex bg-[#d9d9d9] rounded-xl p-1 mb-8">
          <button 
            onClick={() => setType('expense')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              type === 'expense' ? 'bg-[#a3a3a3] text-gray-800' : 'text-gray-500'
            }`}
          >
            Expense
          </button>
          <button 
            onClick={() => setType('income')}
            className={`flex-1 py-2 rounded-lg font-bold transition-all text-sm md:text-base ${
              type === 'income' ? 'bg-[#a3a3a3] text-gray-800' : 'text-gray-500'
            }`}
          >
            Income
          </button>
        </div>

        <div className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Description <span className="text-red-500">*</span>
            </label>
            <input 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 text-sm md:text-base" 
              placeholder="e.g., Coffee at Starbucks"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            />
          </div>
          
          {/* Amount */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Amount <span className="text-red-500">*</span>
            </label>
            <input 
              type="number" 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 text-sm md:text-base" 
              placeholder="0.00"
              min="0"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})} 
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select 
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 font-medium text-sm md:text-base"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            >
              <option value="">Select Category</option>
              {currentCategories.length > 0 ? (
                currentCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  {categories.length === 0 
                    ? 'Loading categories...' 
                    : `No ${type} categories available`}
                </option>
              )}
            </select>
            
            {/* Debug info - remove after fixing */}
            {currentCategories.length === 0 && categories.length > 0 && (
              <p className="text-xs text-red-600 mt-1 ml-1">
                No {type} categories found. Available: {categories.map(c => c.name).join(', ')}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Date (Optional)
            </label>
            <input 
              type="date"
              className="w-full bg-[#d9d9d9] p-3 rounded-xl outline-none text-gray-700 text-xs" 
              value={formData.transaction_date}
              onChange={(e) => setFormData({...formData, transaction_date: e.target.value})} 
            />
            <p className="text-xs text-gray-600 mt-1 ml-1">
              Leave blank to use today's date
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-8 md:mt-10">
          <button 
            onClick={handleClose} 
            className="order-2 sm:order-1 flex-1 py-2.5 bg-[#d9d9d9] text-gray-800 rounded-xl font-bold hover:bg-gray-300 transition-colors text-sm md:text-base"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm} 
            className="order-1 sm:order-2 flex-1 py-2.5 bg-gray-800 text-white rounded-xl font-bold shadow-md hover:bg-gray-700 transition-colors text-sm md:text-base"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}