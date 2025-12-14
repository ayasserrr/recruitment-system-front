import React, { useState, useEffect } from 'react';
import { ChevronRight, Briefcase, Plus, Share2, Brain, ClipboardCheck, Video, Users, Award, List, BarChart3, Star } from 'lucide-react';
import MultiStepForm from './components/MultiStepForm';
import Applications from './components/Applications';
import JobPost from './components/JobPost';
import SemanticAnalysis from './components/SemanticAnalysis';
import TechnicalAssessment from './components/TechnicalAssessment';
import TechnicalInterview from './components/TechnicalInterview';
import HRInterview from './components/HRInterview';
import FinalRanking from './components/FinalRanking';
import Analytics from './components/Analytics';
import Shortlist from './components/Shortlist';
import Home from './components/Home';
import Login from './components/Login';
import Phases from './components/Phases';
import Navbar from './components/Navbar';
import Settings from './components/Settings';
import { DarkModeProvider, useDarkMode } from './contexts/DarkModeContext';
import './App.css';

function RecruitmentSystemContent() {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [currentPage, setCurrentPage] = useState('landing');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    // Initialize auth state from localStorage on component mount
    useEffect(() => {
        try {
            const savedLoginState = localStorage.getItem('isLoggedIn');
            const savedUser = localStorage.getItem('currentUser');

            console.log('Checking localStorage:', { savedLoginState, savedUser });

            if (savedLoginState === 'true' && savedUser) {
                setIsLoggedIn(true);
                setCurrentUser(JSON.parse(savedUser));
                setCurrentPage('phases');
                console.log('Restored login state from localStorage');
            }
        } catch (error) {
            console.error('Error reading from localStorage:', error);
        }
    }, []); // Empty dependency array means this runs only once on mount

    const [applications, setApplications] = useState([
        {
            id: 1,
            jobTitle: 'Senior Software Engineer',
            posted: '2025-10-15',
            cvs: 45,
            newToday: 8,
            semantic: 30,
            assessment: 22,
            techInterview: 10,
            hrInterview: 7,
            finalCandidates: 3,
            status: 'In Progress',
            requisition: {
                selectedPlatforms: ['LinkedIn', 'Indeed'],
                postingStartDate: '2025-10-15',
                postingEndDate: '2025-10-30',
            },
        },
        {
            id: 2,
            jobTitle: 'Data Scientist',
            posted: '2025-10-01',
            cvs: 32,
            newToday: 3,
            semantic: 25,
            assessment: 25,
            techInterview: 8,
            hrInterview: 5,
            finalCandidates: 2,
            status: 'Final Stage',
            requisition: {
                selectedPlatforms: ['LinkedIn'],
                postingStartDate: '2025-10-01',
                postingEndDate: '2025-10-18',
            },
        },
        {
            id: 3,
            jobTitle: 'Product Designer',
            posted: '2025-11-20',
            cvs: 18,
            newToday: 4,
            semantic: 18,
            assessment: 0,
            techInterview: 0,
            hrInterview: 0,
            finalCandidates: 0,
            status: 'CV Collection',
            requisition: {
                selectedPlatforms: ['LinkedIn', 'Glassdoor'],
                postingStartDate: '2025-11-20',
                postingEndDate: '2025-12-05',
            },
        },
        {
            id: 4,
            jobTitle: 'DevOps Engineer',
            posted: '2025-11-28',
            cvs: 0,
            newToday: 0,
            semantic: 0,
            assessment: 0,
            techInterview: 0,
            hrInterview: 0,
            finalCandidates: 0,
            status: 'Submitted',
            requisition: {
                selectedPlatforms: ['Indeed'],
                postingStartDate: '2025-11-28',
                postingEndDate: '2025-12-10',
            },
        },
    ]);

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

    const handleLogin = (user) => {
        setIsLoggedIn(true);
        setCurrentUser(user);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify(user));
        console.log('Login: Saved to localStorage:', { user, isLoggedIn: 'true' });
        setCurrentPage('phases');
    };

    const handleGetStarted = () => {
        setCurrentPage('login');
    };

    const handleLearnMore = () => {
        // Scroll to features section or show more info
        const featuresSection = document.getElementById('features');
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        setCurrentPage('landing');
    };

    const handleNavigateToPhase = (phaseId) => {
        if (phaseId === 'job-requisition') {
            setCurrentPage('job-requisition');
        } else if (phaseId === 'settings') {
            setCurrentPage('settings');
        } else {
            setCurrentPage(phaseId);
        }
    };

    const handleNavigateHome = () => {
        setCurrentPage('phases');
    };

    const renderHome = () => (
        <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-accent-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Briefcase className="w-16 h-16 text-base-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-base-900 mb-4">Recruitment Management System</h1>
                    <p className="text-xl text-base-600">Streamline your hiring process with AI-powered tools</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setCurrentPage(item.id)}
                            className="group bg-white rounded-2xl shadow-soft hover:shadow-card-hover transition-all duration-300 p-8 text-left border border-base-200 hover:border-accent-300 transform hover:-translate-y-4"
                        >
                            <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-base-900 mb-2">{item.label}</h3>
                            <p className="text-sm text-base-600 mb-3">{item.description}</p>
                            <div className="flex items-center text-accent-600 font-semibold">
                                <span className="mr-2">Open</span>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const handleRequisitionSubmitted = (requisition) => {
        const today = new Date();
        const posted = String(requisition?.postingStartDate || '').trim()
            ? requisition.postingStartDate
            : today.toISOString().slice(0, 10);

        setApplications((prev) => [
            {
                id: Date.now(),
                jobTitle: requisition?.jobTitle || 'Untitled Role',
                posted,
                cvs: 0,
                semantic: 0,
                assessment: 0,
                techInterview: 0,
                hrInterview: 0,
                finalCandidates: 0,
                status: 'CV Collection',
                requisition,
            },
            ...prev,
        ]);
    };

    const handleUpdateApplication = (id, patch) => {
        setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    };

    return (
        <div>
            {/* Landing Page */}
            {currentPage === 'landing' && (
                <Home
                    onLoginClick={() => setCurrentPage('login')}
                    onGetStartedClick={handleGetStarted}
                    onLearnMoreClick={handleLearnMore}
                />
            )}

            {/* Login Page */}
            {currentPage === 'login' && (
                <Login
                    onLoginSuccess={handleLogin}
                    onBackClick={() => setCurrentPage('landing')}
                />
            )}

            {/* Authenticated Pages with Navbar */}
            {isLoggedIn && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'settings' && (
                <Navbar
                    currentUser={currentUser}
                    onLogout={handleLogout}
                    onNavigateHome={handleNavigateHome}
                    onNavigateToPhase={handleNavigateToPhase}
                />
            )}

            {/* Settings Page */}
            {currentPage === 'settings' && (
                <Settings
                    currentUser={currentUser}
                    onBack={() => setCurrentPage('phases')}
                    onDarkModeToggle={toggleDarkMode}
                    isDarkMode={isDarkMode}
                />
            )}

            {/* Phases Dashboard */}
            {currentPage === 'phases' && (
                <Phases onNavigateToPhase={handleNavigateToPhase} />
            )}

            {/* Job Requisition Page */}
            {currentPage === 'job-requisition' && (
                <div>
                    <button
                        onClick={() => setCurrentPage('phases')}
                        className="m-6 text-accent-600 hover:text-accent-700 font-semibold flex items-center"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                    <MultiStepForm
                        onSubmitRequisition={handleRequisitionSubmitted}
                        onDone={() => setCurrentPage('phases')}
                    />
                </div>
            )}

            {/* Home Page */}
            {currentPage === 'home' && renderHome()}

            {/* Job Post Page */}
            {currentPage === 'job-post' && (
                <JobPost
                    applications={applications}
                    onUpdateApplication={handleUpdateApplication}
                    onBackToDashboard={() => setCurrentPage('phases')}
                    onViewCVs={() => setCurrentPage('applications')}
                    onOpenSemanticAnalysis={() => setCurrentPage('semantic-analysis')}
                />
            )}

            {/* Semantic Analysis Page */}
            {currentPage === 'semantic-analysis' && (
                <SemanticAnalysis
                    applications={applications}
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* Technical Assessment Page */}
            {currentPage === 'technical-assessment' && (
                <TechnicalAssessment
                    applications={applications}
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* Technical Interview Page */}
            {currentPage === 'technical-interview' && (
                <TechnicalInterview
                    applications={applications}
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* HR Interview Page */}
            {currentPage === 'hr-interview' && (
                <HRInterview
                    applications={applications}
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* Final Ranking Page */}
            {currentPage === 'final-ranking' && (
                <FinalRanking
                    applications={applications}
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* Shortlist Page */}
            {currentPage === 'shortlist' && (
                <Shortlist
                    onBack={() => setCurrentPage('phases')}
                />
            )}

            {/* Applications Page */}
            {currentPage === 'applications' && (
                <Applications applications={applications} onBackToDashboard={() => setCurrentPage('phases')} />
            )}

            {/* Analytics Page */}
            {currentPage === 'analytics' && (
                <Analytics onBack={() => setCurrentPage('phases')} />
            )}
        </div>
    );
}

export default function RecruitmentSystem() {
    return (
        <DarkModeProvider>
            <RecruitmentSystemContent />
        </DarkModeProvider>
    );
}
