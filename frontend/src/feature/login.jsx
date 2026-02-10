import React, { useState } from 'react';
import { ArrowLeft, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import LoginHello from "@/assets/LoginHello.png";


export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      // Handle login logic here
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center p-4"
  style={{
    backgroundImage: `url('${LoginHello}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }}
>
    <div className="w-full max-w-6xl">
        {/* Left Side - Form */}
        <div className="max-w-xl bg-gray-200 rounded-3xl p-12 relative">
          <button className="absolute top-6 left-6 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="max-w-md mx-auto">
            <h1 className="text-4xl font-bold text-center mb-8">WELCOME BACK</h1>
            
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
                className="w-full py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
              >
                Log In
              </button>

              {/* Footer Links */}
              <div className="text-center space-y-2 pt-4">
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-800">
                  Forgot Password?
                </a>
                <a href="#" className="block text-sm text-gray-600 hover:text-gray-800">
                  Create Account
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}