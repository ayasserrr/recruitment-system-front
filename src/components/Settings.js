import React, { useState, useEffect } from 'react';
import { ChevronRight, User, Mail, Building, Phone, Moon, Sun, Lock, Eye, EyeOff, ExternalLink, Unlink } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTour } from '../contexts/TourContext';
import { getLinkedInAuthUrl, getLinkedInConnectionStatus, disconnectLinkedIn } from '../api/authService';

export default function Settings({ currentUser, onBack, onDarkModeToggle, isDarkMode }) {
    const { isDarkMode: contextDarkMode, toggleDarkMode } = useDarkMode();
    const { showTourOnLogin: tourPreference, toggleTourPreference } = useTour();
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [personalInfo, setPersonalInfo] = useState({
        fullName: currentUser?.name || 'Ahmed ayman',
        email: currentUser?.email || 'ahmed@hiretech.com',
        companyName: 'HireTech AI',
        phoneNumber: '+201234567890'
    });
    const [linkedInStatus, setLinkedInStatus] = useState({
        connected: false,
        loading: true,
        companyName: null
    });

    const showMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 3000);
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();

        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmNewPassword) {
            showMessage('Please fill in all password fields', 'error');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmNewPassword) {
            showMessage('New passwords do not match', 'error');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('Password must be at least 6 characters', 'error');
            return;
        }

        // In a real app, this would validate current password and update in database
        showMessage('Password changed successfully!', 'success');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        });
    };

    const handlePersonalInfoChange = (field, value) => {
        setPersonalInfo({
            ...personalInfo,
            [field]: value
        });
    };

    const handleSavePersonalInfo = () => {
        // In a real app, this would save to database
        showMessage('Personal information updated successfully!', 'success');
    };

    // Fetch LinkedIn connection status on component mount
    useEffect(() => {
        const fetchLinkedInStatus = async () => {
            try {
                const result = await getLinkedInConnectionStatus();
                if (result.success) {
                    setLinkedInStatus({
                        connected: result.data.connected || false,
                        loading: false,
                        companyName: result.data.company_name || null
                    });
                } else {
                    setLinkedInStatus({
                        connected: false,
                        loading: false,
                        companyName: null
                    });
                }
            } catch (error) {
                console.error('Failed to fetch LinkedIn status:', error);
                setLinkedInStatus({
                    connected: false,
                    loading: false,
                    companyName: null
                });
            }
        };

        fetchLinkedInStatus();
    }, []);

    const handleLinkedInConnect = async () => {
        try {
            const result = await getLinkedInAuthUrl();
            if (result.success) {
                // Add prompt=login parameter to force new login
                let authUrl = result.data.authorization_url;
                if (authUrl.includes('?')) {
                    authUrl += '&prompt=login';
                } else {
                    authUrl += '?prompt=login';
                }
                // Open LinkedIn auth URL in new window
                window.open(authUrl, '_blank', 'width=600,height=600');
            } else {
                showMessage(`Failed to get LinkedIn authorization: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('LinkedIn connect error:', error);
            showMessage('Failed to connect to LinkedIn', 'error');
        }
    };

    const handleLinkedInDisconnect = async () => {
        try {
            const result = await disconnectLinkedIn();
            if (result.success) {
                setLinkedInStatus({
                    connected: false,
                    loading: false,
                    companyName: null
                });
                showMessage('LinkedIn disconnected successfully', 'success');
            } else {
                showMessage(`Failed to disconnect LinkedIn: ${result.error}`, 'error');
            }
        } catch (error) {
            console.error('LinkedIn disconnect error:', error);
            showMessage('Failed to disconnect LinkedIn', 'error');
        }
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${contextDarkMode ? 'bg-slate-900' : 'bg-gray-50'} p-8`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className={`text-3xl font-bold transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>Account Settings</h1>
                        <p className={`transition-colors duration-300 mt-2 ${contextDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Manage your account information and preferences</p>
                    </div>
                    <button
                        onClick={onBack}
                        className={`font-medium transition-colors duration-300 ${contextDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                    >
                        ← Back to Dashboard
                    </button>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg text-sm transition-colors duration-300 ${messageType === 'success'
                        ? contextDarkMode ? 'bg-green-900 text-green-200 border border-green-700' : 'bg-green-100 text-green-700 border border-green-200'
                        : contextDarkMode ? 'bg-red-900 text-red-200 border border-red-700' : 'bg-red-100 text-red-700 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Personal Information Section */}
                    <div className="lg:col-span-2">
                        <div className={`rounded-xl shadow-sm border transition-colors duration-300 p-6 mb-6 ${contextDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <h2 className={`text-xl font-semibold mb-6 flex items-center transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <User className={`w-5 h-5 mr-2 transition-colors duration-300 ${contextDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                Personal Information
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        value={personalInfo.fullName}
                                        onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                                        className={`w-full px-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${contextDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="email"
                                            value={personalInfo.email}
                                            onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Company Name
                                    </label>
                                    <div className="relative">
                                        <Building className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${contextDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="text"
                                            value={personalInfo.companyName}
                                            onChange={(e) => handlePersonalInfoChange('companyName', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${contextDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                                        <input
                                            type="tel"
                                            value={personalInfo.phoneNumber}
                                            onChange={(e) => handlePersonalInfoChange('phoneNumber', e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSavePersonalInfo}
                                    className={`w-full py-2 rounded-lg transition-colors duration-300 font-medium ${contextDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        {/* Change Password Section */}
                        <div className={`rounded-xl shadow-sm border transition-colors duration-300 p-6 ${contextDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <h2 className={`text-xl font-semibold mb-6 flex items-center transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <Lock className={`w-5 h-5 mr-2 transition-colors duration-300 ${contextDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                Change Password
                            </h2>

                            <form onSubmit={handlePasswordChange} className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Current Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.currentPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                            placeholder="Enter current password"
                                            className={`w-full pr-12 px-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                            placeholder="Enter new password"
                                            className={`w-full pr-12 px-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Confirm New Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={passwordData.confirmNewPassword}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirmNewPassword: e.target.value })}
                                            placeholder="Confirm new password"
                                            className={`w-full pr-12 px-4 py-2 border rounded-lg outline-none transition-colors duration-300 ${contextDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:ring-blue-400 focus:border-blue-400' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${contextDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                                        >
                                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className={`w-full py-2 rounded-lg transition-colors duration-300 font-medium ${contextDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                >
                                    Save Changes
                                </button>
                            </form>
                        </div>

                        {/* Social Integrations Section */}
                        <div className={`rounded-xl shadow-sm border transition-colors duration-300 p-6 mb-6 ${contextDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <h2 className={`text-xl font-semibold mb-6 flex items-center transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                <ExternalLink className={`w-5 h-5 mr-2 transition-colors duration-300 ${contextDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                                Social Integrations
                            </h2>

                            <div className="space-y-4">
                                {/* LinkedIn Integration */}
                                <div className={`p-4 border rounded-lg transition-colors duration-300 ${contextDarkMode ? 'border-slate-700 bg-slate-700/50' : 'border-gray-200 bg-gray-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${contextDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                                                <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className={`font-semibold transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    LinkedIn Company Page
                                                </h3>
                                                <p className={`text-sm transition-colors duration-300 ${contextDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {linkedInStatus.loading ? 'Checking connection status...' :
                                                        linkedInStatus.connected ? `Connected to ${linkedInStatus.companyName || 'your company page'}` :
                                                            'Connect your LinkedIn company page for enhanced recruiting'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            {linkedInStatus.loading ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                                            ) : linkedInStatus.connected ? (
                                                <button
                                                    onClick={handleLinkedInDisconnect}
                                                    className={`px-4 py-2 rounded-lg transition-colors duration-300 font-medium flex items-center space-x-2 ${contextDarkMode ? 'bg-red-600 text-white hover:bg-red-700' : 'bg-red-600 text-white hover:bg-red-700'}`}
                                                >
                                                    <Unlink className="w-4 h-4" />
                                                    <span>Disconnect LinkedIn</span>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleLinkedInConnect}
                                                    className={`px-4 py-2 rounded-lg transition-colors duration-300 font-medium flex items-center space-x-2 ${contextDarkMode ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                    <span>Connect LinkedIn</span>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {linkedInStatus.connected && (
                                        <div className={`mt-3 pt-3 border-t transition-colors duration-300 ${contextDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                            <div className="flex items-center space-x-2">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span className={`text-sm transition-colors duration-300 ${contextDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                    Active connection
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Preferences Section */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-xl shadow-sm border transition-colors duration-300 p-6 ${contextDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'}`}>
                            <h2 className={`text-xl font-semibold mb-6 transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>Preferences</h2>

                            <div className="space-y-4">
                                {/* Dark Mode Toggle */}
                                <div className={`flex items-center justify-between p-3 border rounded-lg transition-colors duration-300 ${contextDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <div className="flex items-center">
                                        {contextDarkMode ? <Moon className={`w-5 h-5 mr-2 transition-colors duration-300 ${contextDarkMode ? 'text-blue-400' : 'text-blue-600'}`} /> : <Sun className={`w-5 h-5 mr-2 transition-colors duration-300 ${contextDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />}
                                        <span className={`font-medium transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>Dark Mode</span>
                                    </div>
                                    <button
                                        onClick={toggleDarkMode}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${contextDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${contextDarkMode ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>

                                {/* Show Tour on Login Toggle */}
                                <div className={`flex items-center justify-between p-3 border rounded-lg transition-colors duration-300 ${contextDarkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                                    <span className={`font-medium transition-colors duration-300 ${contextDarkMode ? 'text-white' : 'text-gray-900'}`}>Show Tour on Login</span>
                                    <button
                                        onClick={toggleTourPreference}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tourPreference ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tourPreference ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                        />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
