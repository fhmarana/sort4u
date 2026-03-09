import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import EmailSentGIF from "@/assets/EmailSent.gif";

export default function EmailConfirmationPopup({ email, onClose }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const handleResend = async () => {
    if (resendTimer > 0) return; // Prevent spamming

      try {
        await axios.post('http://localhost:8000/auth/resend-otp', { email });
        setResendTimer(60); // Start 60-second countdown
        setError(""); // Clear any previous errors
        
        // Simple interval to count down
        const interval = setInterval(() => {
          setResendTimer((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } catch (err) {
        setError("Failed to resend code. Please try again.");
      }
    };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (error) setError("");

    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter the full 6-digit code");
      return;
    }

    try {
      setError("");
      await axios.post('http://localhost:8000/auth/verify-otp', { email, otp: otpString });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      console.error("Validation Error:", err.response?.data);
      setError("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-sm text-center">
        
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-gray-400 hover:text-black transition-colors"
        >
          <ArrowLeft size={20} />
        </button>

        <img
          src={EmailSentGIF}
          alt="Email sent"
          className="w-32 sm:w-40 mx-auto mb-6 mix-blend-multiply contrast-[1.2] brightness-[1]"
        />

        <h1 className="text-xl sm:text-2xl font-bold mb-2">Check your inbox!</h1>
        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          We've sent a password reset code to:
        </p>

        <div className="bg-gray-100 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium break-all mb-6 text-blue-600">
          {email}
        </div>

        <div className="flex justify-center gap-1.5 sm:gap-3 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength="1"
              ref={(el) => (inputRefs.current[index] = el)}
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold border-b-2 transition-colors focus:outline-none ${
                error
                  ? "border-red-500 text-red-600"
                  : "border-gray-300 focus:border-green-500"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-xs sm:text-sm font-semibold mb-4 text-center">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3.5 rounded-xl w-full transition-all shadow-md active:scale-[0.98]"
        >
          Verify Code
        </button>

        <div className="mt-4 text-xs sm:text-sm text-gray-500">
          Didn't receive the code? {" "}
          {resendTimer > 0 ? (
            <span className="font-semibold text-gray-400">
              Resend in {resendTimer}s
            </span>
          ) : (
            <button 
              onClick={handleResend}
              className="text-green-600 font-bold hover:underline transition-all"
            >
              Resend Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
}