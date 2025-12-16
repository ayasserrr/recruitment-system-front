import React, { useState, useEffect, useRef } from 'react';
import { Zap, Home, Briefcase, User, LogOut, Settings, ChevronDown, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Navbar({ currentUser, onLogout, onNavigateHome, onNavigateToPhase }) {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className={`transition-colors duration-300 border-b ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-base-200'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={onNavigateHome}
                            className="flex items-center space-x-2 transition-colors hover:opacity-80"
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                                <img
                                    src={isDarkMode ? "/light.png" : "/dark.png"}
                                    alt="HireTechAI Logo"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <span className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>HireTechAI</span>
                        </button>
                    </div>

                    {/* Navigation Items */}
                    <div className="flex items-center space-x-6">
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-400 hover:text-accent-400 hover:bg-slate-700' : 'text-base-600 hover:text-accent-600 hover:bg-base-100'}`}
                            title="Toggle dark mode"
                        >
                            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className={`flex items-center space-x-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:text-accent-400' : 'text-base-700 hover:text-accent-600'}`}
                            >
                                <div className="w-8 h-8 bg-gradient-to-r from-base-500 to-accent-500 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <span className="font-medium">
                                    Hi, {currentUser?.name || 'User'}
                                </span>
                                <ChevronDown className="w-4 h-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border py-2 z-50 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900 border-slate-600' : 'bg-white shadow-base-200 border-base-200'}`}>
                                    <button
                                        onClick={() => onNavigateToPhase('settings')}
                                        className={`w-full flex items-center space-x-2 px-4 py-2 transition-colors ${isDarkMode ? 'text-gray-300 hover:bg-slate-600' : 'text-base-700 hover:bg-base-50'}`}
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                    <div className={`border-t my-1 ${isDarkMode ? 'border-slate-600' : 'border-base-100'}`}></div>
                                    <button
                                        onClick={onLogout}
                                        className={`w-full flex items-center space-x-2 px-4 py-2 transition-colors ${isDarkMode ? 'text-accent-400 hover:bg-slate-600' : 'text-accent-600 hover:bg-accent-50'}`}
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
