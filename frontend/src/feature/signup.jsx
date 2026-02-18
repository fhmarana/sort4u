import React, { useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Signup from "@/assets/SignupGIF.gif";
import SignupMB from "@/assets/SignupMB.gif";
import axios from 'axios';

export default function SignupPage() {
const navigate = useNavigate();
const [isLoading, setIsLoading] = useState(false);
const [errors, setErrors] = useState({});
const [apiError, setApiError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };``

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
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

		setIsLoading(true);
		setApiError('');

		try {
			const response = await axios.post('/auth/signup', {
				full_name: formData.name,
				email: formData.email,
				password: formData.password,
			});

			localStorage.setItem('token', response.data.access_token);
			localStorage.setItem('user', JSON.stringify(response.data.user));
			navigate('/dashboard');
		} catch (error) {
			const message = error.response?.data?.detail || 'Signup failed. Please try again.';
			setApiError(message);
		} finally {
			setIsLoading(false);
		}
	};

  return (
    <div className="h-[100dvh] w-full bg-white flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      <div className="w-full max-w-6xl flex flex-col lg:flex-row gap-8 items-center justify-center h-full">
        
        {/* Back Button */}
        <Link to="/" className="absolute top-6 left-6 z-20">
          <button className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>

        {/* Form Container: Now a contained box on both mobile and desktop */}
        <div className="w-full max-w-[450px] lg:max-w-none lg:flex-1 bg-gray-200 rounded-[2rem] p-6 sm:p-12 relative order-1 shadow-xl lg:shadow-none">
          
          <div className="max-w-md mx-auto w-full">
            <header className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-4xl font-bold mb-1">Create Your Account</h1>
              <p className="text-xs sm:text-sm text-gray-500">Please fill in details to create your account</p>
            </header>
            {apiError && (
							<div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm text-center">
								{apiError}
							</div>
						)}
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
									<p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Enter your Email"
                />
                {errors.email && (
									<p className="mt-1 text-sm text-red-600">{errors.email}</p>
								)}
              </div>

              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                  placeholder="Enter your password"
                />
                {errors.password && (
									<p className="mt-1 text-sm text-red-600">{errors.password}</p>
								)}
              </div>
              
              <div className="relative pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-gray-600 text-white rounded-full font-bold hover:bg-gray-700 transition-colors flex justify-center items-center gap-2 relative z-10"
                >
                  {isLoading ? (
					<>
						<Loader2 className="animate-spin w-5 h-5" />
						Creating Account...
					</>
					) : (
					'Create Account'
					)}
                </button>

                {/* Mobile GIF - Waving over the button */}
                <div className="block lg:hidden absolute top-5 -right-10 w-28 h-28 pointer-events-none z-20">
                  <img 
                    src={SignupMB} 
                    alt="Waving" 
                    className="w-full h-full object-contain" 
                  />
                </div>
              </div>

              <div className="text-center">
                <Link to="/login" className="text-xs sm:text-sm text-gray-600 hover:text-gray-800">
                  Already a member? <span className="font-bold">Log in</span>
                </Link>
              </div>
            </form>
          </div>
        </div>
        
        {/* Right Side UI - Desktop GIF */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center order-2">
          <div className="w-full max-w-lg"> 
            <img 
              src={Signup} 
              alt="Signup Animation Desktop" 
              className="w-full h-auto mix-blend-multiply contrast-[1.2] brightness-[1]" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}