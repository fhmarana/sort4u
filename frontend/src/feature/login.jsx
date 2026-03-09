import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginGif from "@/assets/LoginGIF.gif";
import waving from "@/assets/waving.gif";
import LSBackgroundDecorations from "@/components/LSBackDeco";

export default function LoginPage() {
const navigate = useNavigate();

const [showPassword, setShowPassword] = useState(false);
const [formData, setFormData] = useState({
  email: '',
  password: '',
  rememberMe: false
});

const [errors, setErrors] = useState({});
const [loading, setLoading] = useState(false);
const [apiError, setApiError] = useState('');

const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));

  if (errors[name]) {
    setErrors(prev => ({ ...prev, [name]: '' }));
  }
};

const validateForm = () => {
  const newErrors = {};

  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!formData.password) {
    newErrors.password = 'Password is required';
  }

  return newErrors;
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const newErrors = validateForm();

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  setLoading(true);
  setApiError('');

  try {
    const response = await axios.post('/auth/login', {
      email: formData.email,
      password: formData.password,
    });

    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));

    navigate('/dashboard');

  } catch (error) {
    const message = error.response?.data?.detail || 'Login failed. Please try again.';
    setApiError(message);
  } finally {
    setLoading(false);
  }
};

return (
<div className="h-[100dvh] w-full bg-white flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
  <LSBackgroundDecorations />

  <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center h-full">

    {/* Back Button */}
    <Link to="/" className="absolute top-6 left-6 z-20">
      <button className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
        <ArrowLeft className="w-5 h-5 text-white" />
      </button>
    </Link>

    {/* Form Container */}
    <div className="w-full max-w-[450px] lg:max-w-none lg:flex-1 bg-gray-200 rounded-[2rem] p-6 sm:p-12 relative order-1 shadow-xl lg:shadow-none">

      {/* Mobile GIF */}
      <div className="absolute -top-24 -right-4 lg:hidden">
        <img src={waving} className="w-28 h-28 object-contain" />
      </div>

      <div className="max-w-md mx-auto w-full">

        <header className="text-center mb-6 sm:mb-6">
          <h1 className="text-2xl sm:text-4xl font-bold mb-2">WELCOME BACK</h1>
          <p className="text-xs sm:text-sm text-gray-500">
            Login to continue using SORT4U
          </p>
        </header>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.email ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-gray-300 rounded-xl pr-12 focus:outline-none focus:ring-2 focus:ring-gray-500 ${
                errors.password ? 'ring-2 ring-red-500' : ''
              }`}
              placeholder="Enter your password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[30px] text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <Eye size={18}/> : <EyeOff size={18}/>}
            </button>

            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Remember */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="w-4 h-4 text-gray-600 bg-gray-300 border-gray-400 rounded"
            />

            <label className="ml-2 text-sm text-gray-700">
              Remember me
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-700 transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          {/* Links */}
          <div className="text-center space-y-3 pt-2">

            <Link
              to="/forgot-password"
              className="block text-xs sm:text-sm text-gray-600 hover:text-gray-800"
            >
              Forgot Password?
            </Link>

            <Link to="/signup" className="text-xs sm:text-sm text-gray-600">
              Don't have an account? <span className="font-bold">Create Account</span>
            </Link>

          </div>

        </form>
      </div>
    </div>

    {/* Desktop GIF */}
    <div className="hidden lg:flex lg:flex-1 items-center justify-center order-2">
      <div className="w-full max-w-lg">
        <img
          src={LoginGif}
          className="w-full h-auto mix-blend-multiply contrast-[1.2] brightness-[1]"
        />
      </div>
    </div>

  </div>
</div>
);
}