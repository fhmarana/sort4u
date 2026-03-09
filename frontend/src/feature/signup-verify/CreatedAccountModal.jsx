import React from 'react';
import ConfirmationGIF from "@/assets/Confirmation.gif";

export default function CreatedAccountModal({ onGoToDashboard }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center shadow-2xl">
          <img
                    src={ConfirmationGIF}
                    alt="Confirmation illustration"
                    className="w-32 sm:w-40 md:w-48 mx-auto object-contain mix-blend-multiply mb-4"
                  />

        <h2 className="text-2xl font-bold mb-2">Account Created!</h2>
        <p className="text-sm text-gray-500 mb-8">
          Your account has been successfully verified. Welcome aboard!
        </p>
        <button
          onClick={onGoToDashboard}
          className="w-full py-4 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-700 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}