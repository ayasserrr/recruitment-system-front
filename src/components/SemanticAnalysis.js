import React, { useState, useMemo } from 'react';
import { Brain, ChevronRight, CheckCircle, Eye, Users, Clock, FileText, Download, ArrowLeft, Star } from 'lucide-react';

export default function SemanticAnalysis({ applications, onBack }) {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [showCVModal, setShowCVModal] = useState(null);
    const [showReportModal, setShowReportModal] = useState(null);

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    // Mock candidate generator per application
    const generateCandidates = (app) => {
        const totalCandidates = app.cvs || 0;
        const processed = Math.min(totalCandidates, Math.floor(totalCandidates * 0.9));
        const highMatch = Math.floor(processed * 0.27);
        const mediumMatch = Math.floor(processed * 0.4);
        const lowMatch = processed - highMatch - mediumMatch;

        const firstNames = ['Sarah', 'Michael', 'Emma', 'James', 'Alex', 'Priya', 'David', 'Lisa', 'Robert', 'Maria', 'John', 'Anna', 'William', 'Sophie', 'Thomas'];
        const lastNames = ['Johnson', 'Chen', 'Williams', 'Brown', 'Rodriguez', 'Sharma', 'Smith', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore'];

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
            const name = `${firstNames[i % firstNames.length]} ${lastNames[i % lastNames.length]}`;
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
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
                                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                                </button>
                            )}
                            <Brain className="w-12 h-12 text-purple-600 mr-4" />
                            <div>
                                <h1 className="text-4xl font-bold text-slate-800">Semantic Analysis</h1>
                                <p className="text-slate-600">AI-powered candidate matching based on job requirements</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => (
                            <button
                                key={app.id}
                                onClick={() => setSelectedAppId(app.id)}
                                className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                    ? 'border-purple-500 bg-purple-50'
                                    : 'border-slate-200 hover:border-purple-300'
                                    }`}
                            >
                                <div className="text-left">
                                    <h3 className="font-bold text-slate-800">{app.jobTitle}</h3>
                                    <div className="text-sm text-slate-600 mt-1">
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
                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalCandidates}</div>
                                <div className="text-sm text-slate-600">Total Candidates</div>
                                <div className="text-xs text-slate-400 mt-1">Processed: {stats.processed}</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-3xl font-bold text-green-600 mb-2">{stats.highMatch}</div>
                                <div className="text-sm text-slate-600">High Match</div>
                                <div className="text-xs text-slate-400 mt-1">Score ≥ 80</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.mediumMatch}</div>
                                <div className="text-sm text-slate-600">Medium Match</div>
                                <div className="text-xs text-slate-400 mt-1">Score 60-79</div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6">
                                <div className="text-3xl font-bold text-slate-600 mb-2">{stats.avgScore.toFixed(1)}</div>
                                <div className="text-sm text-slate-600">Average Score</div>
                                <div className="text-xs text-slate-400 mt-1">Overall match quality</div>
                            </div>
                        </div>

                        {/* Job Details Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">{selectedApp.jobTitle}</h2>
                                    <p className="text-slate-600">Analysis completed on {new Date().toISOString().split('T')[0]}</p>
                                </div>
                                <div className="bg-purple-50 text-purple-700 px-4 py-2 rounded-lg font-semibold">
                                    Processed in 2.5 seconds
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-slate-700 mb-3">Required Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {['Python', 'Java', 'System Design', 'AWS', 'Docker', 'SQL', 'Algorithms'].map((skill, index) => (
                                        <span key={index} className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center">
                                    <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                                    <div>
                                        <h4 className="font-bold text-slate-800">Analysis Complete</h4>
                                        <p className="text-sm text-slate-600">
                                            Processed {stats.processed} candidates. {stats.highMatch} candidates have high match scores (≥80).
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Candidates List */}
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Top Matching Candidates</h2>
                                <div className="text-sm text-slate-600">
                                    Sorted by match score • Showing {candidates.length} of {stats.highMatch} high-match candidates
                                </div>
                            </div>

                            <div className="space-y-6">
                                {candidates.map((candidate, index) => (
                                    <div
                                        key={index}
                                        className="border-2 border-slate-200 rounded-xl p-6 hover:border-purple-500 transition-all duration-300 hover:shadow-lg"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                                            <div className="mb-4 md:mb-0">
                                                <div className="flex items-center mb-3">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4 ${index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                                        index === 1 ? 'bg-slate-100 text-slate-600' :
                                                            index === 2 ? 'bg-orange-100 text-orange-600' :
                                                                'bg-slate-50 text-slate-500'
                                                        }`}>
                                                        #{index + 1}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-800">{candidate.name}</h3>
                                                        <div className="flex items-center mt-2">
                                                            <span className={`text-4xl font-bold ${getScoreColor(candidate.score)} mr-3`}>
                                                                {candidate.score}
                                                            </span>
                                                            <div>
                                                                <div className="text-sm text-slate-600">Semantic Match Score</div>
                                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(candidate.match)}`}>
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
                                                    className="bg-slate-600 hover:bg-slate-700 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    Show CV
                                                </button>
                                                <button
                                                    onClick={() => setShowReportModal(candidate)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <Eye className="w-5 h-5 mr-2" />
                                                    View Full Report
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        // Add to shortlist functionality
                                                        const shortlistData = {
                                                            ...candidate,
                                                            email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`,
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
                                                        // Store in localStorage for persistence across pages
                                                        const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
                                                        const existingCV = existingShortlist.find(cv => cv.name === candidate.name && cv.email === shortlistData.email);
                                                        if (!existingCV) {
                                                            localStorage.setItem('shortlist', JSON.stringify([...existingShortlist, shortlistData]));
                                                            alert(`${candidate.name} has been added to your shortlist!`);
                                                        } else {
                                                            alert(`${candidate.name} is already in your shortlist.`);
                                                        }
                                                    }}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-lg font-semibold flex items-center transition-colors"
                                                >
                                                    <Star className="w-5 h-5 mr-2" />
                                                    Add to Shortlist
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-semibold text-slate-700 mb-3">Matched Skills:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-200 transition-colors"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
                                                <div className="text-center">
                                                    <div className="text-sm text-slate-600">Skills Match</div>
                                                    <div className="text-lg font-bold text-purple-600">{candidate.score - 10}%</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-slate-600">Experience Level</div>
                                                    <div className="text-lg font-bold text-slate-700">
                                                        {candidate.score >= 90 ? 'Senior' : candidate.score >= 80 ? 'Mid-Senior' : 'Mid-Level'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-slate-600">Education Match</div>
                                                    <div className="text-lg font-bold text-green-600">
                                                        {candidate.score >= 85 ? 'High' : 'Medium'}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-sm text-slate-600">Recommendation</div>
                                                    <div className="text-lg font-bold text-green-600">
                                                        {candidate.score >= 85 ? 'Strong' : candidate.score >= 75 ? 'Moderate' : 'Review'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Distribution Chart */}
                            <div className="mt-8 pt-8 border-t border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800 mb-6">Score Distribution</h3>
                                <div className="space-y-4">
                                    {scoreDistribution.map((item, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-20 text-sm font-medium text-slate-700">{item.range}</div>
                                            <div className="flex-1 ml-4">
                                                <div
                                                    className="h-8 rounded-lg transition-all duration-500"
                                                    style={{
                                                        width: `${stats.processed > 0 ? (item.count / stats.processed) * 100 : 0}%`,
                                                        backgroundColor: getScoreBarColor(parseInt(item.range.split('-')[0]))
                                                    }}
                                                />
                                            </div>
                                            <div className="w-16 text-right text-sm font-semibold text-slate-700">{item.count}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 flex justify-end space-x-4">
                                <button
                                    onClick={downloadReport}
                                    className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-colors flex items-center"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Export Report
                                </button>
                                <button
                                    onClick={proceedToTechnicalAssessment}
                                    className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                                >
                                    Proceed to Technical Assessment
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Select an Application</h3>
                        <p className="text-slate-500">Choose an application from the list above to view semantic analysis results</p>
                    </div>
                )}

                {/* CV Modal */}
                {showCVModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-8 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Candidate CV</h2>
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="text-center pb-6 border-b border-slate-200">
                                        <h3 className="text-xl font-bold text-slate-800">{mockCV.name}</h3>
                                        <div className="text-slate-600 mt-2">
                                            <div>{mockCV.email}</div>
                                            <div>{mockCV.phone}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-2">Professional Summary</h4>
                                        <p className="text-slate-600">{mockCV.summary}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-2">Experience</h4>
                                            <p className="text-slate-600">{mockCV.experience}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-slate-700 mb-2">Education</h4>
                                            <p className="text-slate-600">{mockCV.education}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-slate-700 mb-2">Key Projects</h4>
                                        <ul className="space-y-2">
                                            {mockCV.projects.map((project, index) => (
                                                <li key={index} className="flex items-start">
                                                    <ChevronRight className="w-4 h-4 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                                                    <span className="text-slate-600">{project}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end space-x-4">
                                    <button
                                        onClick={() => setShowCVModal(null)}
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button
                                        onClick={() => downloadCV(showCVModal)}
                                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
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
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-slate-800">Full Candidate Report</h2>
                                    <button
                                        onClick={() => setShowReportModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-5 h-5 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {/* Candidate Header */}
                                    <div className="text-center pb-6 border-b border-slate-200">
                                        <h3 className="text-2xl font-bold text-slate-800">{showReportModal.name}</h3>
                                        <div className="flex items-center justify-center mt-3">
                                            <span className={`text-3xl font-bold ${getScoreColor(showReportModal.score)} mr-4`}>
                                                {showReportModal.score}
                                            </span>
                                            <span className={`px-4 py-2 rounded-full text-lg font-semibold ${getMatchColor(showReportModal.match)}`}>
                                                {showReportModal.match} Match
                                            </span>
                                        </div>
                                    </div>

                                    {/* Match Breakdown */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 rounded-xl p-6">
                                            <h4 className="font-bold text-slate-800 mb-4">Match Analysis</h4>
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600">Skills Match</span>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                            <div
                                                                className="bg-purple-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score - 10}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-purple-600">{showReportModal.score - 10}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600">Experience Fit</span>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                            <div
                                                                className="bg-blue-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score - 15}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-blue-600">{showReportModal.score - 15}%</span>
                                                    </div>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-slate-600">Education Match</span>
                                                    <div className="flex items-center">
                                                        <div className="w-32 bg-slate-200 rounded-full h-2 mr-3">
                                                            <div
                                                                className="bg-green-600 h-2 rounded-full"
                                                                style={{ width: `${showReportModal.score >= 85 ? 90 : 75}%` }}
                                                            />
                                                        </div>
                                                        <span className="font-semibold text-green-600">{showReportModal.score >= 85 ? 90 : 75}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-purple-50 rounded-xl p-6">
                                            <h4 className="font-bold text-slate-800 mb-4">Candidate Profile</h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Experience Level</span>
                                                    <span className="font-semibold text-slate-700">
                                                        {showReportModal.score >= 90 ? 'Senior' : showReportModal.score >= 80 ? 'Mid-Senior' : 'Mid-Level'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Recommendation</span>
                                                    <span className="font-semibold text-green-600">
                                                        {showReportModal.score >= 85 ? 'Strong Hire' : showReportModal.score >= 75 ? 'Consider' : 'Review'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Availability</span>
                                                    <span className="font-semibold text-blue-600">Immediate</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-slate-600">Location</span>
                                                    <span className="font-semibold text-slate-700">Remote/On-site</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Skills Analysis */}
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-4">Skills Analysis</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <h5 className="font-semibold text-slate-700 mb-2">Matched Skills</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {showReportModal.skills.map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="font-semibold text-slate-700 mb-2">Additional Skills Detected</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {['Git', 'Agile', 'Testing', 'CI/CD', 'Documentation'].map((skill, i) => (
                                                        <span key={i} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AI Insights */}
                                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
                                        <h4 className="font-bold text-slate-800 mb-3">AI Insights</h4>
                                        <div className="space-y-2 text-slate-700">
                                            <p>• Strong alignment with core technical requirements</p>
                                            <p>• Experience level matches position expectations</p>
                                            <p>• Skill set covers {showReportModal.skills.length} out of 7 required skills</p>
                                            <p>• Profile shows consistent career progression</p>
                                            <p>• Recommended for next assessment stage</p>
                                        </div>
                                    </div>

                                    {/* Recommendation Summary */}
                                    <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-start">
                                            <CheckCircle className="w-6 h-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-slate-800 mb-2">Recommendation Summary</h4>
                                                <p className="text-slate-700 mb-3">
                                                    {showReportModal.name} demonstrates strong qualifications for this position with an overall match score of {showReportModal.score}.
                                                    The candidate possesses {showReportModal.skills.length} key skills that align with your requirements and shows appropriate experience level.
                                                </p>
                                                <div className="flex gap-3">
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                                        ✓ Technical Skills Match
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
                                                        ✓ Experience Level Fit
                                                    </span>
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
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
                                        className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                    >
                                        Close
                                    </button>
                                    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                        Schedule Interview
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
