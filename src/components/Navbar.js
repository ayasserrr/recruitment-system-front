import React, { useState } from 'react';
import { Zap, Home, Briefcase, User, LogOut, Settings, ChevronDown } from 'lucide-react';

export default function Navbar({ currentUser, onLogout, onNavigateHome }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <Zap className="w-8 h-8 text-blue-600" />
                        <span className="text-2xl font-bold text-gray-800">HireFlowAI</span>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-6">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <Home className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </button>

                        <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Briefcase className="w-5 h-5" />
                            <span className="font-medium">Jobs</span>
                        </button>
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                onClick={toggleDropdown}
                                className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-blue-600" />
                                </div>
                                <span className="font-medium">
                                    Hi, {currentUser?.name || 'User'}
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                        onClick={onLogout}
                                        className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
