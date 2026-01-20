import React, { useMemo, useState, useEffect } from 'react';
import { ArrowLeft, Brain, Download, Eye, EyeOff, Filter, TrendingUp, Users, CheckCircle, FileText, Star, ChevronRight } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function SemanticAnalysis({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showCVModal, setShowCVModal] = useState(null);
    const [showReportModal, setShowReportModal] = useState(null);
    const [shortlistedKeys, setShortlistedKeys] = useState(new Set());

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    const getCandidateShortlistKey = (cv) => {
        const name = cv?.name || '';
        const email = cv?.email || '';
        return `${name}::${email}`;
    };

    const loadShortlistedKeys = () => {
        const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
        setShortlistedKeys(new Set(existingShortlist.map(getCandidateShortlistKey)));
    };

    useEffect(() => {
        loadShortlistedKeys();

        const handleStorageChange = () => {
            loadShortlistedKeys();
        };

        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const downloadFullReport = () => {
        if (!showReportModal) return;

        const reportData = {
            reportType: 'Semantic Analysis - Full Candidate Report',
            application: {
                id: selectedApp?.id ?? null,
                jobTitle: selectedApp?.jobTitle || null,
            },
            candidate: {
                name: showReportModal.name,
                score: showReportModal.score,
                match: showReportModal.match,
                skills: showReportModal.skills,
            },
            generatedAt: new Date().toISOString(),
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const safeName = String(showReportModal.name || 'candidate')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '');
        const safeJob = String(selectedApp?.jobTitle || 'job')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-_]/g, '');
        const dateStr = new Date().toISOString().split('T')[0];
        const exportFileDefaultName = `semantic-report-${safeJob}-${safeName}-${dateStr}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Mock candidate generator per application
    const generateCandidates = (app) => {
        const totalCandidates = app.cvs || 0;
        const processed = Math.min(totalCandidates, Math.floor(totalCandidates * 0.9));
        const highMatch = Math.floor(processed * 0.27);
        const mediumMatch = Math.floor(processed * 0.4);
        const lowMatch = processed - highMatch - mediumMatch;

        const jobTitle = String(app?.jobTitle || '').toLowerCase();
        const isData = jobTitle.includes('data') || jobTitle.includes('science') || jobTitle.includes('analytics');

        const firstNames = isData
            ? ['Aya', 'Jomana', 'Tarneed', 'Salma', 'Eman', 'Ahmed', 'Yasser', 'Khaled', 'Nour', 'Mariam', 'Omar', 'Hany', 'Mostafa', 'Heba', 'Menna', 'Hossam']
            : ['Aya', 'Jomana', 'Tarneed', 'Salma', 'Eman', 'Ahmed', 'Yasser', 'Khaled', 'Nour', 'Mariam', 'Omar', 'Hany', 'Mostafa', 'Heba', 'Menna', 'Hossam'];
        const lastNames = isData
            ? ['Abdelrahman', 'Mostafa', 'Younes', 'Kamel', 'Hassan', 'Saeed', 'Ali', 'Mahmoud', 'Ibrahim', 'Gamal', 'Nabil', 'Farag', 'Hegazy', 'Shahin', 'Fathy', 'Samir']
            : ['Yasser', 'Ahmed', 'Khaled', 'Omar', 'Hassan', 'Ali', 'Mahmoud', 'Ibrahim', 'Fathy', 'Saeed', 'Gamal', 'Nabil', 'Farag', 'Samir', 'Hegazy', 'Shahin'];

        const raw = `${app?.id ?? ''}-${app?.jobTitle ?? ''}`;
        let offset = 0;
        for (let i = 0; i < raw.length; i++) {
            offset = ((offset << 5) - offset) + raw.charCodeAt(i);
            offset |= 0;
        }
        offset = Math.abs(offset);

        const skillPools = [
            ['Python', 'ML', 'Data Analysis', 'TensorFlow', 'SQL'],
            ['Java', 'Spring', 'Microservices', 'Kubernetes', 'AWS'],
            ['React', 'Node.js', 'AWS', 'TypeScript', 'Docker'],
            ['C++', 'Algorithms', 'DSA', 'System Design', 'Python'],
            ['JavaScript', 'Vue.js', 'MongoDB', 'Express', 'REST API'],
            ['Python', 'Django', 'PostgreSQL', 'Redis', 'Celery'],
            ['Go', 'Docker', 'Kubernetes', 'gRPC', 'PostgreSQL'],
            ['Ruby', 'Rails', 'MySQL', 'Sidekiq', 'AWS'],
            ['PHP', 'Laravel', 'MySQL', 'Redis', 'Vue.js'],
            ['Swift', 'iOS', 'Xcode', 'Core Data', 'SwiftUI']
        ];

        const candidates = [];
        for (let i = 0; i < Math.min(highMatch + mediumMatch, 12); i++) {
            const name = `${firstNames[(i + offset) % firstNames.length]} ${lastNames[(i + offset) % lastNames.length]}`;
            const isHigh = i < highMatch;
            const score = isHigh ? 92 - Math.floor(Math.random() * 8) : 78 - Math.floor(Math.random() * 8);
            const skills = skillPools[i % skillPools.length];
            const match = isHigh ? (score >= 90 ? 'Excellent' : 'Very Good') : 'Good';

            candidates.push({ name, score, skills, match });
        }

        return { candidates, stats: { totalCandidates, processed, highMatch, mediumMatch, lowMatch, avgScore: processed > 0 ? 82.5 : 0 } };
    };

    const { candidates, stats } = useMemo(() => {
        return selectedApp ? generateCandidates(selectedApp) : { candidates: [], stats: { totalCandidates: 0, processed: 0, highMatch: 0, mediumMatch: 0, lowMatch: 0, avgScore: 0 } };
    }, [selectedApp]);

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

    const getDarkModeMatchColor = (match) => {
        switch (match) {
            case 'Excellent': return 'bg-green-900 text-green-300';
            case 'Very Good': return 'bg-blue-900 text-blue-300';
            case 'Good': return 'bg-orange-900 text-orange-300';
            default: return 'bg-slate-700 text-slate-300';
        }
    };

    const getScoreBarColor = (score) => {
        if (score >= 90) return '#10b981';
        if (score >= 80) return '#3b82f6';
        if (score >= 70) return '#f97316';
        if (score >= 60) return '#eab308';
        return '#ef4444';
    };

    const scoreDistribution = [
        { range: '90-100', count: candidates.filter(c => c.score >= 90).length, color: 'bg-green-500' },
        { range: '80-89', count: candidates.filter(c => c.score >= 80 && c.score < 90).length, color: 'bg-blue-500' },
        { range: '70-79', count: candidates.filter(c => c.score >= 70 && c.score < 80).length, color: 'bg-orange-500' },
        { range: '60-69', count: candidates.filter(c => c.score >= 60 && c.score < 70).length, color: 'bg-yellow-500' },
        { range: '0-59', count: candidates.filter(c => c.score < 60).length, color: 'bg-red-500' }
    ];

    const mockCV = {
        name: showCVModal?.name || '',
        email: `${showCVModal?.name?.toLowerCase().replace(' ', '.')}@email.com`,
        phone: '+1 (555) 123-4567',
        experience: '5+ years',
        education: 'Bachelor\'s in Computer Science',
        summary: 'Experienced software engineer with strong technical skills and a proven track record of delivering high-quality solutions.',
        projects: [
            'Led development of microservices architecture serving 1M+ users',
            'Implemented machine learning pipeline reducing processing time by 40%',
            'Built real-time analytics dashboard with React and Node.js'
        ]
    };

    // Download report functionality
    const downloadReport = () => {
        const reportData = {
            jobTitle: selectedApp?.jobTitle || 'Unknown',
            candidates: candidates.map((c, index) => ({
                rank: index + 1,
                name: c.name,
                score: c.score,
                match: c.match,
                skills: c.skills
            })),
            stats: {
                totalCandidates: stats.totalCandidates,
                processed: stats.processed,
                highMatch: stats.highMatch,
                mediumMatch: stats.mediumMatch,
                lowMatch: stats.lowMatch,
                avgScore: stats.avgScore
            },
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `semantic-analysis-report-${selectedApp?.jobTitle || 'report'}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Download CV functionality
    const downloadCV = (candidate) => {
        const cvData = {
            name: candidate.name,
            email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`,
            phone: '+1 (555) 123-4567',
            experience: '5+ years',
            education: 'Bachelor\'s in Computer Science',
            summary: 'Experienced software engineer with strong technical skills and a proven track record of delivering high-quality solutions.',
            projects: [
                'Led development of microservices architecture serving 1M+ users',
                'Implemented machine learning pipeline reducing processing time by 40%',
                'Built real-time analytics dashboard with React and Node.js'
            ],
            score: candidate.score,
            match: candidate.match,
            skills: candidate.skills,
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(cvData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `cv-${candidate.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Proceed to Technical Assessment
    const proceedToTechnicalAssessment = () => {
        const selectedCandidates = candidates.filter(c => c.score >= 70).map(c => ({
            name: c.name,
            score: c.score,
            match: c.match,
            skills: c.skills,
            status: 'Ready for Assessment'
        }));

        const dataStr = JSON.stringify(selectedCandidates, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `candidates-for-technical-assessment-${new Date().toISOString().split('T')[0]}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 p-8 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-base-50 via-base-100 to-accent-50'}`}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className={`mr-4 p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-white'}`}>
                                    <ArrowLeft className={`w-6 h-6 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                </button>
                            )}
                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-14 h-14 rounded-lg mr-4">
                                <Brain className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className={`text-4xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Semantic Analysis</h1>
                                <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>AI-powered candidate matching based on job requirements</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => (
                            <button
                                key={app.id}
                                onClick={() => setSelectedAppId(app.id)}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                    ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                    : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-base-200 hover:border-accent-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <h3 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{app.jobTitle}</h3>
                                    <div className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        <div>CVs Received: {app.cvs || 0}</div>
                                        <div>Posted: {app.posted}</div>
                                        <div>Status: {app.status}</div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {selectedApp ? (
                    <>
                        {/* Analysis Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{stats.totalCandidates}</div>
                                <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Total Candidates</div>
                                <div className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`}>Processed: {stats.processed}</div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="text-3xl font-bold text-accent-600 mb-2">{stats.highMatch}</div>
                                <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>High Match</div>
                                <div className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`}>Score ≥ 80</div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="text-3xl font-bold text-accent-600 mb-2">{stats.mediumMatch}</div>
                                <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Medium Match</div>
                                <div className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`}>Score 60-79</div>
                            </div>

                            <div className={`rounded-xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-100 to-accent-100 shadow-base-200'}`}>
                                <div className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{stats.avgScore.toFixed(1)}</div>
                                <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Average Score</div>
                                <div className={`text-xs mt-1 transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`}>Overall match quality</div>
                            </div>
                        </div>

                        {/* Job Details Card */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{selectedApp.jobTitle}</h2>
                                    <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Analysis completed on {new Date().toISOString().split('T')[0]}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-base-700'}`}>
                                    Processed in 2.5 seconds
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className={`text-lg font-semibold mb-3 transition-colors ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Required Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'Java', 'System Design', 'AWS', 'Docker', 'SQL', 'Algorithms'].map((skill, index) => (
                                        <span key={index} className={`px-4 py-2 rounded-full font-medium transition-colors ${isDarkMode ? 'bg-slate-700 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-base-700'}`}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-accent-600 mr-3" />
                                    <div>
                                        <h4 className={`font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Analysis Complete</h4>
                                        <p className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            Processed {stats.processed} candidates. {stats.highMatch} candidates have high match scores (≥80).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Candidates List */}
                        <div className={`rounded-2xl shadow-lg p-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className={`text-2xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Top Matching Candidates</h2>
                                <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                    Sorted by match score • Showing {candidates.length} of {stats.highMatch} high-match candidates
                                </div>
                            </div>

                            <div className="space-y-6">
                                {candidates.map((candidate, index) => (
                                    <div
                                        key={index}
                                        className={`border-2 rounded-xl p-6 transition-all duration-300 hover:shadow-lg ${isDarkMode ? 'border-slate-600 hover:border-accent-400 hover:shadow-slate-900' : 'border-base-200 hover:border-accent-500 hover:shadow-base-200'}`}
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center mb-3">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 transition-colors duration-300 ${index === 0 ? 'bg-gradient-to-r from-base-200 to-accent-200 text-accent-600' :
                                                        index === 1 ? 'bg-gradient-to-r from-base-100 to-accent-100 text-base-600' :
                                                            index === 2 ? 'bg-gradient-to-r from-base-200 to-accent-200 text-base-600' :
                                                                isDarkMode ? 'bg-slate-600 text-gray-400' : 'bg-base-50 text-base-500'
                                                        }`}>
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{candidate.name}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <span className={`text-4xl font-bold ${getScoreColor(candidate.score)} mr-3`}>
                                                                {candidate.score}
                                                            </span>
                                                            <div>
                                                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Semantic Match Score</div>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold transition-colors duration-300 ${isDarkMode ? getDarkModeMatchColor(candidate.match) : getMatchColor(candidate.match)}`}>
                                                                    {candidate.match} Match
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => setShowCVModal(candidate)}
                                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    Show CV
                                                </button>
                                                <button
                                                    onClick={() => setShowReportModal(candidate)}
                                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <Eye className="w-5 h-5 mr-2" />
                                                    View Full Report
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const shortlistEmail = `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`;
                                                        const candidateKey = getCandidateShortlistKey({ name: candidate.name, email: shortlistEmail });
                                                        const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
                                                        const updatedShortlist = existingShortlist.filter(cv => getCandidateShortlistKey(cv) !== candidateKey);

                                                        if (updatedShortlist.length !== existingShortlist.length) {
                                                            localStorage.setItem('shortlist', JSON.stringify(updatedShortlist));
                                                            loadShortlistedKeys();
                                                            return;
                                                        }

                                                        const shortlistData = {
                                                            ...candidate,
                                                            jobTitle: selectedApp?.jobTitle || 'Unknown Application',
                                                            email: shortlistEmail,
                                                            phone: '+1 (555) 123-4567',
                                                            experience: '5+ years',
                                                            education: "Bachelor's in Computer Science",
                                                            summary: 'Experienced software engineer with strong technical skills and a proven track record of delivering high-quality solutions.',
                                                            projects: [
                                                                'Led development of microservices architecture serving 1M+ users',
                                                                'Implemented machine learning pipeline reducing processing time by 40%',
                                                                'Built real-time analytics dashboard with React and Node.js'
                                                            ],
                                                            shortlistedFrom: 'Semantic Analysis',
                                                            shortlistedDate: new Date().toISOString().slice(0, 10)
                                                        };
                                                        const shortlistNote = prompt(`Add a note for ${candidate?.name || 'this candidate'} (optional):`, '') || '';
                                                        localStorage.setItem('shortlist', JSON.stringify([...existingShortlist, { ...shortlistData, shortlistNote }]));
                                                        loadShortlistedKeys();
                                                    }}
                                                    className="bg-gradient-to-r from-base-500 to-accent-500 hover:from-base-600 hover:to-accent-600 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <Star
                                                        className="w-5 h-5 mr-2"
                                                        fill={shortlistedKeys.has(getCandidateShortlistKey({ name: candidate.name, email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com` })) ? 'currentColor' : 'none'}
                                                    />
                                                    {shortlistedKeys.has(getCandidateShortlistKey({ name: candidate.name, email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com` })) ? 'Remove from Shortlist' : 'Add to Shortlist'}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className={`text-sm font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Matched Skills:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-gray-300 hover:bg-slate-500' : 'bg-gradient-to-r from-base-100 to-accent-100 text-base-700 hover:from-base-200 hover:to-accent-200'}`}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                                <div className="text-center">
                                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Skills Match</div>
                                                    <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>{candidate.score - 10}%</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Experience Level</div>
                                                    <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                        {candidate.score >= 90 ? 'Senior' : candidate.score >= 80 ? 'Mid-Senior' : 'Mid-Level'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Education Match</div>
                                                    <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                        {candidate.score >= 85 ? 'High' : 'Medium'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Recommendation</div>
                                                    <div className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-accent-400' : 'text-accent-600'}`}>
                                                        {candidate.score >= 85 ? 'Strong' : candidate.score >= 75 ? 'Moderate' : 'Review'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Distribution Chart */}
                            <div className={`mt-8 pt-8 transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                <h3 className={`text-xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Score Distribution</h3>
                                <div className="space-y-4">
                                    {scoreDistribution.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className={`w-20 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{item.range}</div>
                                            <div className="flex-1 ml-4">
                                                <div
                                                    className="h-8 rounded-lg transition-all duration-500"
                                                    style={{
                                                        width: `${stats.processed > 0 ? (item.count / stats.processed) * 100 : 0}%`,
                                                        backgroundColor: getScoreBarColor(parseInt(item.range.split('-')[0]))
                                                    }}
                                                />
                                            </div>
                                            <div className={`w-16 text-right text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={downloadReport}
                                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors flex items-center ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-600 text-base-600 hover:bg-base-50'}`}
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Export Report
                                </button>
                                <button
                                    onClick={proceedToTechnicalAssessment}
                                    className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors"
                                >
                                    Proceed to Technical Assessment
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={`rounded-2xl shadow-lg p-12 text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                        <div className={`flex items-center justify-center w-20 h-20 rounded-lg mx-auto mb-4 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-r from-base-100 to-accent-100'}`}>
                            <Brain className={`w-10 h-10 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-400'}`} />
                        </div>
                        <h3 className={`text-xl font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-700'}`}>Select an Application</h3>
                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Choose an application from the list above to view semantic analysis results</p>
                    </div>
                )}

                {/* CV Modal */}
                {showCVModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className={`rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidate CV</h2>
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-100'}`}
                                    >
                                        <ChevronRight className={`w-5 h-5 rotate-180 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className={`text-center pb-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{mockCV.name}</h3>
                                        <div className={`mt-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                            <div>{mockCV.email}</div>
                                            <div>{mockCV.phone}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Professional Summary</h4>
                                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Experience</h4>
                                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.experience}</p>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Education</h4>
                                            <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{mockCV.education}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Key Projects</h4>
                                        <ul className="space-y-2">
                                            {mockCV.projects.map((project, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ChevronRight className="w-4 h-4 text-accent-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>{project}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => downloadCV(showCVModal)}
                                        className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors"
                                    >
                                        Download CV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Report Modal */}
                {showReportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className={`rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Full Candidate Report</h2>
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className={`p-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-base-100'}`}
                                    >
                                        <ChevronRight className={`w-5 h-5 rotate-180 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Candidate Header */}
                                    <div className={`text-center pb-6 border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <h3 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{showReportModal.name}</h3>
                                        <div className="flex items-center justify-center mt-3">
                                            <span className={`text-3xl font-bold mr-4 ${getScoreColor(showReportModal.score)}`}>
                                                {showReportModal.score}
                                            </span>
                                            <span className={`px-4 py-2 rounded-full text-lg font-semibold transition-colors duration-300 ${isDarkMode ? getDarkModeMatchColor(showReportModal.match) : getMatchColor(showReportModal.match)}`}>
                                                {showReportModal.match} Match
                                            </span>
                                        </div>
                                    </div>

                                    {/* Match Breakdown */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Match Analysis</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Skills Match</span>
                                                    <div className="flex items-center">
                                                        <div className={`w-32 rounded-full h-2 mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                            <div
                                                                className="bg-gradient-to-r from-base-600 to-accent-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score - 10}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-accent-600">{showReportModal.score - 10}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Experience Fit</span>
                                                    <div className="flex items-center">
                                                        <div className={`w-32 rounded-full h-2 mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                            <div
                                                                className="bg-gradient-to-r from-base-600 to-accent-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score - 15}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-accent-600">{showReportModal.score - 15}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Education Match</span>
                                                    <div className="flex items-center">
                                                        <div className={`w-32 rounded-full h-2 mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-base-200'}`}>
                                                            <div
                                                                className="bg-gradient-to-r from-base-600 to-accent-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score >= 85 ? 90 : 75}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-accent-600">{showReportModal.score >= 85 ? 90 : 75}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className={`rounded-xl p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidate Profile</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Experience Level</span>
                                                    <span className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                        {showReportModal.score >= 90 ? 'Senior' : showReportModal.score >= 80 ? 'Mid-Senior' : 'Mid-Level'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Recommendation</span>
                                                    <span className="font-semibold text-accent-600">
                                                        {showReportModal.score >= 85 ? 'Strong Hire' : showReportModal.score >= 75 ? 'Consider' : 'Review'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Availability</span>
                                                    <span className="font-semibold text-accent-600">Immediate</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Location</span>
                                                    <span className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>Remote/On-site</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Analysis */}
                                    <div>
                                        <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Skills Analysis</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Matched Skills</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {showReportModal.skills.map((skill, i) => (
                                                        <span key={i} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-gray-300' : 'bg-gradient-to-r from-base-100 to-accent-100 text-base-700'}`}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className={`font-semibold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>Additional Skills Detected</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Git', 'Agile', 'Testing', 'CI/CD', 'Documentation'].map((skill, i) => (
                                                        <span key={i} className={`px-3 py-1 rounded-lg text-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-gray-400' : 'bg-base-100 text-base-600'}`}>
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insights */}
                                    <div className={`rounded-xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                        <h4 className={`font-bold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>AI Insights</h4>
                                        <div className={`space-y-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            <p>• Strong alignment with core technical requirements</p>
                                            <p>• Experience level matches position expectations</p>
                                            <p>• Skill set covers {showReportModal.skills.length} out of 7 required skills</p>
                                            <p>• Profile shows consistent career progression</p>
                                            <p>• Recommended for next assessment stage</p>
                                        </div>
                                    </div>

                                    {/* Recommendation Summary */}
                                    <div className={`rounded-xl p-6 border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                        <div className="flex items-start">
                                            <CheckCircle className="w-6 h-6 text-accent-600 mr-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className={`font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Recommendation Summary</h4>
                                                <p className={`mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                                    {showReportModal.name} demonstrates strong qualifications for this position with an overall match score of {showReportModal.score}.
                                                    The candidate possesses {showReportModal.skills.length} key skills that align with your requirements and shows appropriate experience level.
                                                </p>
                                                <div className="flex gap-3">
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-accent-400' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>
                                                        ✓ Technical Skills Match
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-accent-400' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>
                                                        ✓ Experience Level Fit
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-lg text-sm font-semibold transition-colors duration-300 ${isDarkMode ? 'bg-slate-600 text-accent-400' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}>
                                                        ✓ Education Alignment
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={downloadFullReport}
                                        className="px-6 py-3 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-lg font-semibold transition-colors flex items-center"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Download Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
