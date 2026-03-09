import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import axios from 'axios';
import EmailSentGIF from "@/assets/EmailSent.gif";

export default function SignupEmailVerModal({ email, onVerify, onClose }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(""); 
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (error) setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === 'Enter' && !otp.includes("")) {
      handleVerify();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await axios.post('http://localhost:8000/auth/resend-signup-otp', { email });
      setResendTimer(60);
      setError("");
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) return;
    
    setIsLoading(true);
    setError(""); 

    try {
      await onVerify(fullOtp); 
    } catch (err) {
      setError(err.message || "Invalid code. Please try again.");
      setIsLoading(false); 

      if (err.message?.includes("expired")) {
        setOtp(new Array(6).fill(""));
        inputRefs.current[0]?.focus();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10 sm:py-16">
      
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      ></div>

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

        <h1 className="text-xl sm:text-2xl font-bold mb-2">
          Check your inbox!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 mb-2">
          We've sent a verification code to:
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
          <p className="text-red-500 text-sm font-medium mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.includes("")}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl w-full transition-all shadow-md active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "Verify Code"
          )}
        </button>

        <div className="mt-4 text-xs sm:text-sm text-gray-500">
          Didn't receive the code?{" "}
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