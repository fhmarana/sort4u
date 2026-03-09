import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmationGIF from "@/assets/Confirmation.gif";

export default function ConfirmationPopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative w-full max-w-md bg-gray-200 rounded-3xl p-6 sm:p-8 md:p-10 text-center shadow-xl">

        <img
          src={ConfirmationGIF}
          alt="Confirmation illustration"
          className="w-32 sm:w-40 md:w-48 mx-auto object-contain mix-blend-multiply mb-4"
        />

        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-6">
          Password Changed Successfully!
        </h1>

        <button 
          onClick={() => navigate('/login')}
          className="w-full py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
        >
          Log in
        </button>

      </div>
    </div>
  );
}