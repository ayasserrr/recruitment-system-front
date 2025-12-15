import React, { useState, useEffect } from 'react';
import { ArrowLeft, Star, Download, Users, Eye, X, Briefcase, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function Shortlist({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showCVModal, setShowCVModal] = useState(null);
    const [shortlistedApplications, setShortlistedApplications] = useState([]);

    // Load shortlisted CVs from localStorage
    useEffect(() => {
        const loadShortlistedCVs = () => {
            const shortlistData = JSON.parse(localStorage.getItem('shortlist') || '[]');

            // Group CVs by phase first, then by application
            const groupedByPhase = shortlistData.reduce((acc, cv) => {
                const phaseName = cv.shortlistedFrom || 'General Application';

                if (!acc[phaseName]) {
                    acc[phaseName] = {
                        phaseName: phaseName,
                        applications: {}
                    };
                }

                // Extract application name from CV data or use default
                // Try multiple fields that might contain the application name
                const appName = cv.jobTitle || cv.applicationName || cv.position ||
                    (cv.applicationTitle) || (cv.role) || 'Senior AI Engineer';

                if (!acc[phaseName].applications[appName]) {
                    acc[phaseName].applications[appName] = {
                        id: appName,
                        jobTitle: appName,
                        posted: cv.shortlistedDate || new Date().toISOString().slice(0, 10),
                        shortlistedCVs: []
                    };
                }

                acc[phaseName].applications[appName].shortlistedCVs.push(cv);
                return acc;
            }, {});

            // Convert to array format
            const phasesData = Object.values(groupedByPhase).map(phase => ({
                ...phase,
                applications: Object.values(phase.applications)
            }));

            setShortlistedApplications(phasesData);

            // Reset selected application if it no longer exists
            if (selectedApplication && !phasesData.find(phase =>
                phase.applications.some(app => app.id === selectedApplication)
            )) {
                setSelectedApplication(null);
            }
        };

        loadShortlistedCVs();

        // Listen for storage changes to update in real-time
        const handleStorageChange = () => {
            loadShortlistedCVs();
        };

        window.addEventListener('storage', handleStorageChange);

        // Also check for changes every 2 seconds as a fallback
        const interval = setInterval(handleStorageChange, 2000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [selectedApplication]);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 80) return 'text-blue-600';
        if (score >= 70) return 'text-orange-600';
        return 'text-red-600';
    };

    const getMatchColor = (match) => {
        switch (match) {
            case 'Excellent': return 'bg-green-100 text-green-700';
            case 'Very Good': return 'bg-blue-100 text-blue-700';
            case 'Good': return 'bg-orange-100 text-orange-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    // Download CV functionality
    const downloadCV = (cv) => {
        const cvData = {
            name: cv.name,
            email: cv.email,
            phone: cv.phone,
            experience: cv.experience,
            education: cv.education,
            summary: cv.summary,
            skills: cv.skills || [],
            projects: cv.projects || [],
            score: cv.score,
            match: cv.match,
            shortlistedFrom: cv.shortlistedFrom,
            shortlistedDate: cv.shortlistedDate,
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(cvData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `cv-${cv.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const removeFromShortlist = (appId, cvId) => {
        // Remove from localStorage
        const shortlistData = JSON.parse(localStorage.getItem('shortlist') || '[]');
        const updatedShortlist = shortlistData.filter(cv => cv.id !== cvId);
        localStorage.setItem('shortlist', JSON.stringify(updatedShortlist));

        // Update state
        setShortlistedApplications(prev =>
            prev.map(app =>
                app.id === appId
                    ? { ...app, shortlistedCVs: app.shortlistedCVs.filter(cv => cv.id !== cvId) }
                    : app
            )
        );
    };

    const totalShortlisted = shortlistedApplications.reduce((acc, phase) =>
        acc + phase.applications.reduce((phaseAcc, app) => phaseAcc + app.shortlistedCVs.length, 0), 0
    );

    if (selectedApplication) {
        // Find the application across all phases
        let foundApplication = null;
        let foundPhase = null;

        for (const phase of shortlistedApplications) {
            const app = phase.applications.find(app => app.id === selectedApplication);
            if (app) {
                foundApplication = app;
                foundPhase = phase;
                break;
            }
        }

        if (!foundApplication) {
            return (
                <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
                    <div className="max-w-7xl mx-auto">
                        <button
                            onClick={() => setSelectedApplication(null)}
                            className={`mb-6 font-semibold flex items-center transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Applications
                        </button>
                        <div className={`rounded-2xl shadow-lg p-12 text-center transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <h3 className={`text-xl font-semibold mb-2 transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Application Not Found</h3>
                            <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>The selected application could not be found.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => setSelectedApplication(null)}
                        className={`mb-6 font-semibold flex items-center transition-colors ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-800'}`}
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Applications
                    </button>

                    <div className={`rounded-2xl shadow-lg p-8 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-3xl font-bold text-base-900 mb-2">{foundApplication.jobTitle}</h1>
                                <p className="text-base-600">Phase: {foundPhase.phaseName} • Posted: {foundApplication.posted}</p>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-accent-600">{foundApplication.shortlistedCVs.length}</div>
                                <div className="text-sm text-base-600">Shortlisted CVs</div>
                            </div>
                        </div>

                        {foundApplication.shortlistedCVs.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="flex items-center justify-center bg-gradient-to-r from-base-100 to-accent-100 w-20 h-20 rounded-lg mx-auto mb-4">
                                    <Users className="w-10 h-10 text-base-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-base-700 mb-2">No Shortlisted CVs</h3>
                                <p className="text-base-500">No CVs have been shortlisted for this application yet.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {foundApplication.shortlistedCVs.map((cv) => (
                                    <div key={cv.id} className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-6 border border-base-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-base-900 mb-1">{cv.name}</h3>
                                                <p className="text-sm text-base-600">{cv.email} • {cv.phone}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${getScoreColor(cv.score)}`}>{cv.score}%</div>
                                                <div className={`text-xs px-2 py-1 rounded-full ${getMatchColor(cv.match)}`}>
                                                    {cv.match}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <div className="flex flex-wrap gap-2">
                                                {(cv.skills || []).map((skill, index) => (
                                                    <span key={index} className="text-xs bg-gradient-to-r from-base-100 to-accent-100 text-accent-700 px-2 py-1 rounded-full">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-sm text-base-600 mb-2">
                                                <span className="font-semibold">Experience:</span> {cv.experience} •
                                                <span className="font-semibold"> Education:</span> {cv.education}
                                            </p>
                                            <p className="text-sm text-base-600 line-clamp-2">{cv.summary}</p>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs text-base-500 mb-1">
                                                Shortlisted from: <span className="font-semibold">{cv.shortlistedFrom}</span>
                                            </p>
                                            <p className="text-xs text-base-500">
                                                Shortlisted on: {cv.shortlistedDate}
                                            </p>
                                        </div>

                                        <div className="flex justify-between items-center pt-4 border-t border-base-200">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setShowCVModal(cv)}
                                                    className="text-accent-600 hover:text-accent-800 font-semibold flex items-center text-sm"
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View CV
                                                </button>
                                                <button onClick={() => downloadCV(cv)} className="text-base-600 hover:text-base-800 font-semibold flex items-center text-sm">
                                                    <Download className="w-4 h-4 mr-1" />
                                                    Download
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeFromShortlist(foundApplication.id, cv.id)}
                                                className="text-base-600 hover:text-base-800 font-semibold flex items-center text-sm"
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* CV Modal */}
                {showCVModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-base-900">{showCVModal.name}'s CV</h2>
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className="text-base-500 hover:text-base-700"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-base-900 mb-2">Contact Information</h3>
                                        <div className="bg-base-50 p-4 rounded-lg">
                                            <p className="text-base-600"><strong>Email:</strong> {showCVModal.email}</p>
                                            <p className="text-base-600"><strong>Phone:</strong> {showCVModal.phone}</p>
                                            <p className="text-base-600"><strong>Experience:</strong> {showCVModal.experience}</p>
                                            <p className="text-base-600"><strong>Education:</strong> {showCVModal.education}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-base-900 mb-2">Professional Summary</h3>
                                        <div className="bg-base-50 p-4 rounded-lg">
                                            <p className="text-base-600">{showCVModal.summary}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-base-900 mb-2">Key Projects</h3>
                                        <div className="bg-base-50 p-4 rounded-lg">
                                            <ul className="list-disc list-inside text-base-600 space-y-2">
                                                {(showCVModal.projects || []).map((project, index) => (
                                                    <li key={index}>{project}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-base-900 mb-2">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(showCVModal.skills || []).map((skill, index) => (
                                                <span key={index} className="bg-gradient-to-r from-base-100 to-accent-100 text-accent-700 px-3 py-1 rounded-full text-sm">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-accent-50 p-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={onBack}
                    className="mb-6 text-base-600 hover:text-base-800 font-semibold flex items-center"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </button>

                <div className="text-center mb-8">
                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-20 h-20 rounded-lg mx-auto mb-4">
                        <Star className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-base-900 mb-4">Shortlisted Candidates</h1>
                    <p className="text-xl text-base-600">Manage your shortlisted CVs across all applications</p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg shadow-base-200 p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-4">
                            <div className="text-3xl font-bold text-accent-600">{shortlistedApplications.length}</div>
                            <div className="text-sm text-base-600">Phases</div>
                        </div>
                        <div className="bg-gradient-to-br from-base-50 to-accent-50 rounded-xl p-4">
                            <div className="text-3xl font-bold text-accent-600">{totalShortlisted}</div>
                            <div className="text-sm text-base-600">Total Shortlisted CVs</div>
                        </div>
                        <div className="bg-gradient-to-br from-base-100 to-accent-100 rounded-xl p-4">
                            <div className="text-3xl font-bold text-base-600">
                                {shortlistedApplications.reduce((acc, phase) =>
                                    acc + phase.applications.filter(app => app.shortlistedCVs.length > 0).length, 0
                                )}
                            </div>
                            <div className="text-sm text-base-600">Active Applications</div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Shortlisted CVs by Phase</h2>

                    {shortlistedApplications.length === 0 ? (
                        <div className="text-center py-12">
                            <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-slate-600 mb-2">No Shortlisted CVs</h3>
                            <p className="text-slate-500">No CVs have been shortlisted yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {shortlistedApplications.map((phase) => (
                                <div key={phase.phaseName} className="border border-slate-200 rounded-xl p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-bold text-slate-800">{phase.phaseName}</h3>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-blue-600">
                                                {phase.applications.reduce((acc, app) => acc + app.shortlistedCVs.length, 0)}
                                            </div>
                                            <div className="text-sm text-slate-600">CVs</div>
                                        </div>
                                    </div>

                                    {phase.applications.length === 0 ? (
                                        <div className="text-center py-8">
                                            <p className="text-slate-500">No applications in this phase yet.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {phase.applications.map((application) => (
                                                <div
                                                    key={application.id}
                                                    onClick={() => setSelectedApplication(application.id)}
                                                    className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200 cursor-pointer hover:from-slate-100 hover:to-slate-200 transition-all"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <ChevronRight className="w-5 h-5 text-slate-400" />
                                                            <div>
                                                                <h4 className="font-semibold text-slate-800">{application.jobTitle}</h4>
                                                                <p className="text-sm text-slate-600">Posted: {application.posted}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-blue-600">{application.shortlistedCVs.length}</div>
                                                                <div className="text-xs text-slate-600">CVs</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
