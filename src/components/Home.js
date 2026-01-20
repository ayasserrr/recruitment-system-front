import React, { useState, useRef } from 'react';
import { Zap, Brain, Target, BarChart3, Video, FileText, ChevronRight, ClipboardCheck, Share2, Star, Award, Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Home({ onLoginClick, onGetStartedClick, onLearnMoreClick }) {
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const handleFeatureCardClick = (featureType) => {
        onLearnMoreClick(featureType);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            {/* Navigation */}
            <nav className={`flex items-center justify-between p-6 max-w-7xl mx-auto transition-colors duration-300`}>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img src="/favicon.png" alt="HireTechAI Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>HireTechAI</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={toggleDarkMode}
                        className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-slate-700' : 'text-gray-600 hover:text-base-900 hover:bg-base-100'}`}
                        aria-label="Toggle dark mode"
                    >
                        {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>
                    <button
                        onClick={onLoginClick}
                        className={`px-6 py-2 border rounded-lg transition-colors font-medium ${isDarkMode ? 'text-accent-400 border-accent-400 hover:bg-accent-400/10' : 'text-accent-600 border-accent-600 hover:bg-accent-50'}`}
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                <div className="mb-8">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-6">
                        <img src="/favicon.png" alt="HireTechAI Logo" className="w-full h-full object-cover" />
                    </div>
                    <h1 className={`text-5xl md:text-6xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Intelligent Recruitment
                    </h1>
                    <p className={`text-xl max-w-3xl mx-auto mb-10 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                        Streamline your hiring process with AI-powered candidate screening, smart ranking, and automated interviews
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={onGetStartedClick}
                            className="px-8 py-3 bg-gradient-to-r from-base-600 to-accent-600 text-white rounded-lg hover:from-base-700 hover:to-accent-700 transition-colors font-medium"
                        >
                            Get Started
                        </button>
                        <button
                            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            className={`px-8 py-3 border rounded-lg transition-colors font-medium ${isDarkMode ? 'bg-slate-700 text-gray-200 border-slate-600 hover:bg-slate-600' : 'bg-white text-base-700 border-base-300 hover:bg-base-50'}`}
                        >
                            Learn More
                        </button>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className={`py-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                <div className="max-w-7xl mx-auto">
                    <h2 className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                        Why Choose HireTech AI?
                    </h2>
                    <div className={`text-center max-w-4xl mx-auto mb-16 ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>
                        <p className="text-lg leading-relaxed">
                            HireTech AI revolutionizes recruitment with <span className="font-semibold text-accent-600">deep semantic analysis</span> that goes beyond simple keyword matching.
                            Our platform generates <span className="font-semibold text-accent-600">comprehensive reports for every phase</span> and produces <span className="font-semibold text-accent-600">detailed final candidate evaluations</span>,
                            ensuring you make data-driven hiring decisions across the complete recruitment lifecycle.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={Share2}
                            title="Smart Job Posting"
                            description="AI-powered job post creation based on job descriptions, with bias detection and scheduled posting across multiple platforms"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('job-posting')}
                        />

                        <FeatureCard
                            icon={Brain}
                            title="Deep Semantic Analysis"
                            description="Advanced AI performs contextual understanding of resumes, analyzing skills, experience, and potential beyond surface-level matching"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('semantic-analysis')}
                        />

                        <FeatureCard
                            icon={ClipboardCheck}
                            title="Customizable Assessment Creation"
                            description="Choose from ready-to-use assessments, customizable templates, or build fully custom evaluations from scratch"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('technical-assessment')}
                        />

                        <FeatureCard
                            icon={Video}
                            title="Flexible Interview Options"
                            description="Choose between AI-conducted, HR-led, or technical interviews with AI feedback for comprehensive candidate evaluation"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('interviews')}
                        />

                        <FeatureCard
                            icon={FileText}
                            title="Candidate Reporting System"
                            description="Generate comprehensive reports after each recruitment phase and detailed final candidate evaluations with actionable insights"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('reporting')}
                        />

                        <FeatureCard
                            icon={BarChart3}
                            title="End-to-End Pipeline Analytics"
                            description="Complete recruitment funnel visibility with conversion metrics, time-to-hire analysis, and ROI tracking"
                            isDarkMode={isDarkMode}
                            onClick={() => handleFeatureCardClick('analytics')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeatureCard({ icon, title, description, isDarkMode, onClick }) {
    const [ripples, setRipples] = useState([]);
    const cardRef = useRef(null);

    const handleMouseEnter = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate the maximum distance from click point to corners
        const corners = [
            { x: 0, y: 0 },
            { x: rect.width, y: 0 },
            { x: 0, y: rect.height },
            { x: rect.width, y: rect.height }
        ];

        const distances = corners.map(corner =>
            Math.sqrt(Math.pow(corner.x - x, 2) + Math.pow(corner.y - y, 2))
        );

        const maxDistance = Math.max(...distances);

        // Create multiple ripples with staggered timing
        const newRipples = [];
        for (let i = 0; i < 3; i++) {
            newRipples.push({
                x,
                y,
                id: Date.now() + i,
                size: maxDistance * 2,
                delay: i * 100 // Stagger each ripple
            });
        }

        setRipples(newRipples);
    };

    const handleMouseLeave = () => {
        // Clear all ripples when mouse leaves
        setRipples([]);
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            ref={cardRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            className={`group relative rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 transform hover:-translate-y-1 overflow-hidden border cursor-pointer ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:border-accent-400' : 'bg-white border-base-100 hover:border-accent-100'}`}
        >
            {/* Ripple container */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {ripples.map((ripple) => (
                    <div
                        key={ripple.id}
                        className={`absolute rounded-full ${isDarkMode ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20' : 'bg-gradient-to-r from-blue-100/40 to-cyan-100/40'}`}
                        style={{
                            left: ripple.x - ripple.size / 2,
                            top: ripple.y - ripple.size / 2,
                            width: ripple.size,
                            height: ripple.size,
                            opacity: 0,
                            animation: `rippleExpand 700ms ease-out ${ripple.delay}ms forwards`,
                            transformOrigin: 'center'
                        }}
                    />
                ))}
            </div>

            {/* Main content */}
            <div className="relative z-10">
                <div className={`bg-gradient-to-r from-base-500 to-accent-500 w-14 h-14 rounded-lg flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md`}>
                    {React.createElement(icon, { className: "w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-180" })}
                </div>

                <h3 className={`text-xl font-bold mb-2 group-hover:text-accent-600 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                    {title}
                </h3>

                <p className={`text-sm mb-4 min-h-[40px] transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                    {description}
                </p>

                <div className="flex items-center text-accent-500 font-medium text-sm">
                    <span className="mr-2 group-hover:mr-3 transition-all duration-300">Learn More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Animated progress bar */}
                <div className={`mt-4 h-1.5 w-full rounded-full overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-100'}`}>
                    <div className="h-full w-0 group-hover:w-full bg-gradient-to-r from-base-500 to-accent-500 transition-all duration-500 ease-out"></div>
                </div>
            </div>

            {/* Add CSS animation */}
            <style jsx>{`
                @keyframes rippleExpand {
                    0% {
                        transform: scale(0);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}
