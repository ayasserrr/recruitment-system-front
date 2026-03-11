import React, { useState, useEffect } from 'react';
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { signup } from '../../api/authService';
import { useDarkMode } from '../../contexts/DarkModeContext';

export default function SignupPage() {
  const { isDarkMode } = useDarkMode();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    first_name: '',
    last_name: '',
    phone: '',
    industry: '',
    website: '',
    address: ''
  });

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || !formData.name) {
      showMessage('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);
    showMessage('', '');

    try {
      const result = await signup(formData);

      if (result.success) {
        showMessage('Account created successfully! Redirecting...', 'success');
        setTimeout(() => {
          window.location.hash = '#phases';
          window.location.reload();
        }, 1500);
      } else {
        showMessage(result.error, 'error');
      }
    } catch (error) {
      showMessage('An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // Clear error message when user starts typing
    if (message && messageType === 'error') {
      setMessage('');
      setMessageType('');
    }
  };

  const handleBackToLogin = () => {
    window.location.hash = '#login';
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
      <div className={`rounded-2xl shadow-xl p-8 w-full max-w-2xl transition-colors duration-300 relative ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
        {/* Back Arrow Button */}
        <button
          onClick={handleBackToLogin}
          className={`absolute top-4 left-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-gray-400 hover:text-gray-300' : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'}`}
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg text-sm transition-colors duration-300 ${messageType === 'success'
            ? isDarkMode ? 'bg-green-900 text-green-200 border border-green-700' : 'bg-green-100 text-green-700 border border-green-200'
            : isDarkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
            {message}
          </div>
        )}

        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mb-6 mx-auto">
            <img src="/favicon.png" alt="HireTechAI Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
            Create Your Company Account
          </h2>
          <p className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
            Join our recruitment platform and find the best talent
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          {/* Company Information Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
              Company Information
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Company Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="company@example.com"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-500 hover:text-base-700'}`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                    Industry
                  </label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'border-base-300'}`}
                  >
                    <option value="">Select an industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="consulting">Consulting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Website
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.company.com"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Company Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your company address"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                />
              </div>
            </div>
          </div>

          {/* Contact Person Section */}
          <div>
            <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
              Contact Person
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition-colors focus:ring-2 focus:ring-accent-500 focus:border-accent-500 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-500' : 'border-base-300'}`}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-600 text-white py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
            Already have an account?{' '}
            <button
              onClick={handleBackToLogin}
              className={`font-medium transition-colors ${isDarkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-700'}`}
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
