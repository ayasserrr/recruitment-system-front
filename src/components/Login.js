import React, { useState } from 'react';
import { Zap, Eye, EyeOff } from 'lucide-react';
import userDatabase from '../utils/userDatabase';

export default function Login({ onLoginSuccess, onBackClick }) {
    const [activeTab, setActiveTab] = useState('signin');
    const [showPassword, setShowPassword] = useState(false);
    const [showSignUpPassword, setShowSignUpPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        confirmPassword: ''
    });

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        const result = userDatabase.authenticateUser(formData.email, formData.password);
        if (result.success) {
            showMessage('Login successfully!', 'success');
            setTimeout(() => {
                onLoginSuccess(result.user);
            }, 1000);
        } else {
            showMessage(result.message, 'error');
        }
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            showMessage('Please fill in all fields', 'error');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        const result = userDatabase.addUser({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });

        if (result.success) {
            showMessage('Account created successfully! Please sign in.', 'success');
            setTimeout(() => {
                setActiveTab('signin');
                setFormData({ ...formData, password: '', confirmPassword: '' });
            }, 1500);
        } else {
            showMessage(result.message, 'error');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-accent-50 flex items-center justify-center px-6">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Message Display */}
                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${messageType === 'success'
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}
                {/* Logo and Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-base-500 to-accent-500 rounded-2xl mx-auto mb-4">
                        <Zap className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-base-900">
                        {activeTab === 'signin' ? 'Welcome Back' : 'Welcome'}
                    </h2>
                    <p className="text-base-600 mt-2">
                        {activeTab === 'signin' ? 'Sign in to your account' : 'Create your account'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex mb-6 border-b border-base-200">
                    <button
                        onClick={() => setActiveTab('signin')}
                        className={`flex-1 pb-3 text-center font-medium transition-colors ${activeTab === 'signin'
                            ? 'text-accent-600 border-b-2 border-accent-600'
                            : 'text-base-500 hover:text-base-700'
                            }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setActiveTab('signup')}
                        className={`flex-1 pb-3 text-center font-medium transition-colors ${activeTab === 'signup'
                            ? 'text-accent-600 border-b-2 border-accent-600'
                            : 'text-base-500 hover:text-base-700'
                            }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Sign In Form */}
                {activeTab === 'signin' && (
                    <form onSubmit={handleSignIn}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className="w-full px-4 py-3 pr-12 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-500 hover:text-base-700"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent-600 text-white py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                        >
                            Sign In
                        </button>
                    </form>
                )}

                {/* Sign Up Form */}
                {activeTab === 'signup' && (
                    <form onSubmit={handleSignUp}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showSignUpPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className="w-full px-4 py-3 pr-12 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-base-500 hover:text-base-700"
                                >
                                    {showSignUpPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-base-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Confirm your password"
                                className="w-full px-4 py-3 border border-base-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-accent-600 text-white py-3 rounded-lg hover:bg-accent-700 transition-colors font-medium"
                        >
                            Sign Up
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => setActiveTab('signup')}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}
