import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ForgotPassGIF from "@/assets/ForgotPass.gif";
import BackgroundDecorations from "@/components/BackgroundDesign";
import EmailSentModal from "@/feature/forgot-pass/EmailSentModal";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState(''); // New state for the error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      await axios.post('http://localhost:8000/auth/forgot-password', { email }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setIsSent(true);

    } catch (err) {
      if (err.response?.status === 404) {
        setError("No user with this email");
      } else {
        setError("Something went wrong. Please try again.");
      }
      console.error("Full Error details:", err.response?.data);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 bg-gray-100 overflow-hidden">
      <BackgroundDecorations />

      {isSent && (
        <EmailSentModal
          email={email}
          onClose={() => setIsSent(false)}
        />
      )}

      <div className="relative max-w-md w-full bg-gray-200 rounded-3xl p-6 md:p-10 text-center">
        <button onClick={() => navigate('/login')} className="absolute top-4 left-4 md:top-6 md:left-6">
          <ArrowLeft size={20} />
        </button>

        <img
          src={ForgotPassGIF}
          alt="Password reset illustration"
          className="w-32 md:w-50 h-auto mx-auto mb-4 mix-blend-multiply"
        />

        <h1 className="text-lg md:text-2xl font-bold mb-2">Forgot your Password?</h1>

        <p className="text-xs md:text-sm text-gray-600 mb-6 px-2">
          No worries! Just pop your email in below, and we'll send you a link to set up a new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            required
            className={`w-full p-3 text-xs md:text-base  rounded-lg bg-gray-300 transition-colors ${
              error ? 'border-2 border-red-500 outline-none' : 'border-none'
            }`}
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
          />

          {/* Error Message Display */}
          {error && (
            <p className="text-red-500 text-xs text-left ml-1 animate-pulse">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-gray-600 text-white hover:bg-gray-700 rounded-full transition-all text-xs md:text-base font-medium"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}