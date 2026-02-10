	import React, { useState } from 'react';
	import { ArrowLeft, Image } from 'lucide-react';
	import { Link } from 'react-router-dom';
	export default function LoginPage() {
	  const [formData, setFormData] = useState({
	    name: '',
	    email: '',
	    password: '',
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
	    if (!formData.name) {
	        newErrors.name = 'Name is required';
	    }
	    
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
	    <div className="min-h-screen bg-white flex items-center justify-center p-4">
	      <div className="w-full max-w-6xl flex gap-8 items-center">
	        {/* Left Side - Form */}
	        <div className="flex-1 bg-gray-200 rounded-3xl p-12 relative">
	          <Link to="/">
	            <button className="absolute top-6 left-6 w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
	              <ArrowLeft className="w-5 h-5 text-white" />
	            </button>
	          </Link>
	          
	          <div className="max-w-md mx-auto">
	            <h1 className="text-3xl font-bold text-center mb-1">Create Your Account</h1>
	            <p className="text-sm text-gray-500 text-center mb-6">
	                Please fill in the details to create your account
	            </p>
	            <form onSubmit={handleSubmit} className="space-y-6">
	            {/* Name Field */}
	<div className="mb-6">
	  <label className="block text-sm font-medium text-gray-700 mb-2">
	    Name
	  </label>
	  <input
	    type="text"
	    name="name"
	    value={formData.name}
	    onChange={handleChange}
	    className={`w-full px-4 py-3 bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all ${
	      errors.name ? 'border-2 border-red-500' : ''
	    }`}
	    placeholder="Enter your full name"
	  />
	  {errors.name && (
	    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
	  )}
	</div>
	{/* Email Field */}
	<div className="mb-6">
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
	<div className="mb-10">
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
	
	              {/* create account */}
	              <button
	                type="create account"
	                className="w-full py-3 bg-gray-600 text-white rounded-full font-medium hover:bg-gray-700 transition-colors"
	              >
	                Create Account
	              </button>
	              {/* Footer Links */}
	            <div className="text-center space-y-2 pt-4">
	            <Link
	                to="/login"
	                className="text-sm text-gray-600 hover:text-gray-800">
	                Already a member? <span className="font-bold">Log in</span>
	            </Link>
	            </div>
	
	            </form>
	          </div>
	        </div>
	        {/* Right Side - Image Placeholder */}
	        <div className="flex-1 flex items-center justify-center">
	          <div className="w-64 h-64 bg-black rounded-2xl flex items-center justify-center">
	            <Image className="w-24 h-24 text-white" />
	          </div>
	        </div>
	      </div>
	    </div>
	  );
	}
