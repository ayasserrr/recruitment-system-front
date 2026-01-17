import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Briefcase, Plus, Share2, Brain, ClipboardCheck, Video, Users, Award, List, BarChart3, Star, X, Lightbulb, Info } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import PhaseExplanationModal from './PhaseExplanationModal';

export default function Phases({ onNavigateToPhase }) {
    const { isDarkMode } = useDarkMode();
    const [selectedPhase, setSelectedPhase] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showHoverTip, setShowHoverTip] = useState(false);

    useEffect(() => {
        const dismissed = localStorage.getItem('phasesHoverTipDismissed');
        setShowHoverTip(dismissed !== 'true');
    }, []);

    const menuItems = [
        { id: 'job-requisition', icon: Plus, label: 'Create Job Requisition', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Capture requisition requirements' },
        { id: 'job-post', icon: Share2, label: 'Job Post', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Manage postings' },
        { id: 'semantic-analysis', icon: Brain, label: 'Semantic Analysis', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'AI candidate matching' },
        { id: 'technical-assessment', icon: ClipboardCheck, label: 'Technical Assessment', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Test management' },
        { id: 'technical-interview', icon: Video, label: 'Technical Interview', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Interview scheduling' },
        { id: 'hr-interview', icon: Users, label: 'HR Interview', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Cultural fit assessment' },
        { id: 'final-ranking', icon: Award, label: 'Final Ranking', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Candidate ranking' },
        { id: 'shortlist', icon: Star, label: 'Shortlist', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Manage shortlisted CVs' },
        { id: 'applications', icon: List, label: 'Applications', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Application tracking' },
        { id: 'analytics', icon: BarChart3, label: 'Analytics', color: 'bg-gradient-to-r from-base-500 to-accent-500', description: 'Performance insights' },
    ];

    const handleShowPhaseExplanation = (phaseId) => {
        setSelectedPhase(phaseId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPhase(null);
    };

    const dismissHoverTip = () => {
        localStorage.setItem('phasesHoverTipDismissed', 'true');
        setShowHoverTip(false);
    };

    const showTipAgain = () => {
        localStorage.setItem('phasesHoverTipDismissed', 'false');
        setShowHoverTip(true);
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Briefcase className={`w-16 h-16 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                    </div>
                    <h1 className={`text-5xl font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Recruitment Dashboard</h1>
                    <p className={`text-xl transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Manage your hiring process with AI-powered tools</p>
                </div>

                {showHoverTip && (
                    <div className="fixed inset-x-0 bottom-6 z-50 px-4">
                        <div
                            className={`relative mx-auto w-full max-w-xl rounded-3xl border shadow-2xl backdrop-blur-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-800/70 border-slate-600 shadow-slate-950/60' : 'bg-white/70 border-base-200 shadow-base-900/15'}`}
                            role="note"
                        >
                            <div className="absolute inset-0 rounded-3xl pointer-events-none" />

                            <button
                                type="button"
                                onClick={dismissHoverTip}
                                className={`absolute right-4 top-4 rounded-full p-2 transition-colors ${isDarkMode ? 'bg-slate-700/60 text-gray-200 hover:bg-slate-700 hover:text-white' : 'bg-base-100/80 text-base-600 hover:bg-base-100 hover:text-base-900'}`}
                                aria-label="Dismiss pro tip"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-5 px-7 py-7">
                                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${isDarkMode ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' : 'bg-gradient-to-br from-cyan-100 to-blue-100'}`}>
                                    <Lightbulb className={`h-7 w-7 ${isDarkMode ? 'text-cyan-300' : 'text-base-700'}`} />
                                </div>

                                <div className="min-w-0">
                                    <div className={`text-3xl font-extrabold leading-tight tracking-tight ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Pro-Tip</div>
                                    <div className={`mt-1 text-base leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                        Hover on any phase for <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-base-900'}`}>2 seconds</span> to open its details.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {!showHoverTip && (
                    <div className="fixed bottom-6 right-6 z-40">
                        <button
                            type="button"
                            onClick={showTipAgain}
                            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md transition-colors ${isDarkMode ? 'bg-slate-800/70 border-slate-600 text-gray-200 hover:bg-slate-800' : 'bg-white/70 border-base-200 text-base-800 hover:bg-white'}`}
                        >
                            <Info className="h-4 w-4" />
                            Show Pro-Tip
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map((item) => (
                        <PhaseCard
                            key={item.id}
                            item={item}
                            onNavigateToPhase={onNavigateToPhase}
                            onShowPhaseExplanation={handleShowPhaseExplanation}
                            isDarkMode={isDarkMode}
                        />
                    ))}
                </div>

                {/* Phase Explanation Modal */}
                <PhaseExplanationModal
                    phase={selectedPhase}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onNavigateToPhase={onNavigateToPhase}
                />
            </div>
        </div>
    );
}

function PhaseCard({ item, onNavigateToPhase, onShowPhaseExplanation, isDarkMode }) {
    const [ripples, setRipples] = useState([]);
    const [hoverTimer, setHoverTimer] = useState(null);
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

        // Set 2-second timer to show phase explanation
        const timer = setTimeout(() => {
            onShowPhaseExplanation(item.id);
        }, 2000); // 2 seconds

        setHoverTimer(timer);
    };

    const handleMouseLeave = () => {
        // Clear all ripples when mouse leaves
        setRipples([]);

        // Clear the hover timer
        if (hoverTimer) {
            clearTimeout(hoverTimer);
            setHoverTimer(null);
        }
    };

    const handleClick = (e) => {
        // Always navigate to the phase when clicked
        onNavigateToPhase(item.id);
    };

    return (
        <button
            ref={cardRef}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`group relative rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 text-left transform hover:-translate-y-1 overflow-hidden border cursor-pointer ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:border-accent-400' : 'bg-white border-base-100 hover:border-accent-100'}`}
            title="Click to open phase"
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
                <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-md`}>
                    <item.icon className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-180" />
                </div>

                <h3 className={`text-xl font-bold mb-2 group-hover:text-accent-600 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                    {item.label}
                </h3>

                <p className={`text-sm mb-4 min-h-[40px] transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>
                    {item.description}
                </p>

                <div className="flex items-center text-accent-500 font-medium text-sm">
                    <span className="mr-2 group-hover:mr-3 transition-all duration-300">Open Phase</span>
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
        </button>
    );
}