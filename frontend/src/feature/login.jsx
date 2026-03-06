import React, { useState } from 'react';
import { ArrowLeft, Image } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginHello from "@/assets/LoginHello.png";
import waving from "@/assets/waving.gif";
import LoginGif from "@/assets/LoginGIF.gif";

export default function LoginPage() {
  const navigate = useNavigate();
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
    // Clear error when user starts typing
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
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
  <div className="min-h-screen flex items-center justify-start pl-[8%] lg:pl-[23%] px-0 lg:px-4 py-8">
    <div className="relative flex items-center">

      {/* GIF - outside the box, only on lg screens */}
      <img
        src={LoginGif}
        alt="illustration"
        className="absolute left-[calc(100%+2rem)] w-auto h-[870px] object-contain hidden lg:block mix-blend-multiply contrast-[1.2] brightness-[1]"
      />

      {/* Form Box */}
      <div className="w-full lg:w-[520px] lg:max-w-none">
        {/* Mobile GIF - top left corner, only on mobile */}
          <div className="absolute -top-25 -right-1 lg:hidden z-0">
           <img
            src={waving}
            alt="illustration"
            className="w-36 h-36 object-contain"
            />
          </div>
        <div className="bg-gray-200 rounded-3xl p-8 lg:p-12 relative z-10">
          
          <button onClick={() => navigate('/')} className="absolute top-6 left-6 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8 pt-8 lg:pt-0">WELCOME BACK</h1>
              
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                      errors.email ? 'border-2 border-red-500' : ''
                    }`}
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
                      errors.password ? 'border-2 border-red-500' : ''
                    }`}
                    placeholder="Enter your password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-gray-600 bg-gray-300 border-gray-400 rounded focus:ring-gray-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Logging in...' : 'Log In'}
                </button>

                {/* Footer Links */}
                <div className="text-center space-y-3 pt-4">
                  <a
                    href="#"
                    className="block text-sm text-gray-600 hover:text-gray-800 hover:underline transition-all"
                  >
                    Forgot Password?
                  </a>

                  <div className="flex items-center justify-center gap-2 text-sm">
                    <p className="text-gray-700">Don't have an account?</p>
                    <Link
                      to="/signup"
                      className="text-gray-600 font-semibold hover:text-gray-900 hover:underline transition-all"
                    >
                      Create Account
                    </Link>
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}