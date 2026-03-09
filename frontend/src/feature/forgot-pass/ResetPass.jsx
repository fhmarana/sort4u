import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios';
import BackgroundDecorations from "@/components/BackgroundDesign";
import ResetPassGIF from "@/assets/ResetPass.gif";
import ConfirmationPopup from "@/feature/forgot-pass/ConfirmationModal";
import { Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation(); 
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleReset = async (e) => {
  e.preventDefault();
  setError('');

  // 1. Password Match Check
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  // 2. Length Check
  if (password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  // 3. Regex Check (1 Uppercase and 1 Special Character)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).*$/;
  if (!passwordRegex.test(password)) {
    setError("Password must contain at least one uppercase letter and one special character.");
    return;
  }

  // 4. "Old Password" Check
  // Assuming 'oldPassword' is passed via location.state
  const oldPassword = location.state?.oldPassword;
  if (oldPassword && password === oldPassword) {
    setError("New password cannot be the same as your old password.");
    return;
  }

  if (!email) {
    alert("Session expired. Please start the reset process again.");
    return;
  }

  try {
    await axios.post('http://localhost:8000/auth/reset-password', {
      email: email,       
      new_password: password
    });
    setIsSuccess(true);
  } catch (err) {
    const errorMsg = err.response?.data?.detail || "Something went wrong.";
    setError(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
  }
};

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 overflow-hidden relative px-4 py-10">
      
      <BackgroundDecorations />

      {isSuccess && <ConfirmationPopup />}

      <div className="w-full max-w-sm sm:max-w-md bg-gray-200 relative z-10 rounded-3xl text-center overflow-hidden shadow-xl">

        {/* Image */}
        <img src={ResetPassGIF} 
        alt="Reset password illustration" 
        className="w-full mix-blend-multiply contrast-[1.2] brightness-[1]" 
        />

        {/* Content */}
        <div className="p-6 sm:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Reset Password
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Enter a new password you’ll inevitably forget in three weeks.
          </p>

          <form onSubmit={handleReset} className="space-y-4">

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pr-12 rounded-lg bg-gray-300 text-sm sm:text-base"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
            </div>

            {/* Confirm */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full p-3 pr-12 rounded-lg bg-gray-300 text-sm sm:text-base"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs text-left animate-pulse">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition"
            >
              Reset
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}