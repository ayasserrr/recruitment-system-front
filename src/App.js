import React, { useState } from 'react';
import { ChevronRight, Briefcase, Plus, Share2, Brain, ClipboardCheck, Video, Users, Award, List } from 'lucide-react';
import MultiStepForm from './components/MultiStepForm';
import Applications from './components/Applications';
import JobPost from './components/JobPost';
import SemanticAnalysis from './components/SemanticAnalysis';
import TechnicalAssessment from './components/TechnicalAssessment';
import './App.css';

export default function RecruitmentSystem() {
    const [currentPage, setCurrentPage] = useState('home');
    const [showJobRequisition, setShowJobRequisition] = useState(false);
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
        { id: 'job-requisition', icon: Plus, label: 'Create Job Requisition', color: 'bg-blue-500', description: 'Capture requisition requirements' },
        { id: 'job-post', icon: Share2, label: 'Job Post', color: 'bg-green-500', description: 'Manage postings' },
        { id: 'semantic-analysis', icon: Brain, label: 'Semantic Analysis', color: 'bg-purple-500', description: 'AI candidate matching' },
        { id: 'technical-assessment', icon: ClipboardCheck, label: 'Technical Assessment', color: 'bg-orange-500', description: 'Test management' },
        { id: 'technical-interview', icon: Video, label: 'Technical Interview', color: 'bg-red-500', description: 'Interview scheduling' },
        { id: 'hr-interview', icon: Users, label: 'HR Interview', color: 'bg-pink-500', description: 'Cultural fit assessment' },
        { id: 'final-ranking', icon: Award, label: 'Final Ranking', color: 'bg-yellow-500', description: 'Candidate ranking' },
        { id: 'applications', icon: List, label: 'Applications', color: 'bg-indigo-500', description: 'Application tracking' },
    ];

    const renderHome = () => (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Briefcase className="w-16 h-16 text-blue-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-slate-800 mb-4">Recruitment Management System</h1>
                    <p className="text-xl text-slate-600">Streamline your hiring process with AI-powered tools</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                if (item.id === 'job-requisition') {
                                    setShowJobRequisition(true);
                                } else {
                                    setCurrentPage(item.id);
                                }
                            }}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2"
                        >
                            <div className={`${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.label}</h3>
                            <p className="text-sm text-slate-600 mb-3">{item.description}</p>
                            <div className="flex items-center text-blue-600 font-semibold">
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
            {showJobRequisition ? (
                <div>
                    <button
                        onClick={() => setShowJobRequisition(false)}
                        className="m-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                    <MultiStepForm
                        onSubmitRequisition={handleRequisitionSubmitted}
                        onDone={() => {
                            setShowJobRequisition(false);
                            setCurrentPage('home');
                        }}
                    />
                </div>
            ) : currentPage === 'home' ? (
                renderHome()
            ) : currentPage === 'job-post' ? (
                <JobPost
                    applications={applications}
                    onUpdateApplication={handleUpdateApplication}
                    onBackToDashboard={() => setCurrentPage('home')}
                />
            ) : currentPage === 'semantic-analysis' ? (
                <SemanticAnalysis
                    applications={applications}
                    onBack={() => setCurrentPage('home')}
                />
            ) : currentPage === 'technical-assessment' ? (
                <TechnicalAssessment
                    applications={applications}
                    onBack={() => setCurrentPage('home')}
                />
            ) : currentPage === 'applications' ? (
                <Applications applications={applications} onBackToDashboard={() => setCurrentPage('home')} />
            ) : (
                <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
                    <button
                        onClick={() => setCurrentPage('home')}
                        className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                    >
                        <ChevronRight className="w-5 h-5 rotate-180 mr-2" />
                        Back to Dashboard
                    </button>
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">
                            {menuItems.find((item) => item.id === currentPage)?.label || 'Page'}
                        </h2>
                        <p className="text-slate-600">
                            This feature is under development. The Job Requisition creation is now available as a multi-step form.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
