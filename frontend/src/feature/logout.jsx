import React, { useEffect } from 'react';

export default function Logout({ onClose, onConfirm }) {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
      onClick={onClose}
    >
      {/* Logout Modal Container */}
      <div 
        className="bg-[#D1D5DB] w-[650px] h-[390px] rounded-[2.5rem] overflow-hidden shadow-2xl relative border-[6px] border-[#4B5563] animate-in fade-in zoom-in duration-200 cursor-auto"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside
      >
        
        {/* Dark Top Bar */}
        <div className="bg-[#4B5563] h-9 flex flex-col justify-center px-4 relative text-white">
        </div>

        {/* Separator Line */}
        <div className="mt-2.5">
          <div className="h-2 w-full bg-[#4B5563] opacity-90" />
        </div>

        {/* Content Area */}
        <div className="flex flex-col items-center justify-center h-[calc(100%-70px)] px-12 text-center">
          
          <h2 className="text-3xl font-black text-[#1F2937] mb-3 tracking-tight">
            Leaving SORT4U for now?
          </h2>
          
          <p className="text-[#4B5563] opacity-50 font-bold text-sm leading-tight mb-10 max-w-[280px]">
            Don't worry – You can log back in anytime to continue tracking your tasks and goals.
          </p>

          {/* Action Buttons */}
          <div className="flex gap-8 w-full justify-center">
            
            {/* Cancel Button */}
            <button 
            onClick={onClose}
            className="bg-[#9CA3AF] text-white font-black text-lg py-2.5 px-10 rounded-full hover:bg-gray-500 transition-all active:scale-95 shadow-md"
            >
            Cancel
            </button>
            
            <button 
              onClick={onConfirm}
              className="bg-[#F87171] text-white font-black text-lg py-2.5 px-10 rounded-full hover:bg-red-500 transition-all active:scale-95 shadow-md"
            >
              Log out
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}