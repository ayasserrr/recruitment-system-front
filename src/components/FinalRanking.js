import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trophy, Download, TrendingUp, Star, Heart, BarChart, Sparkles, Target, Award, Users, Filter, Briefcase, FileText, CheckCircle, Code, MessageSquare } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function FinalRanking({ applications, onBack }) {
    const { isDarkMode } = useDarkMode();

    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('overallScore');
    const [showCVModal, setShowCVModal] = useState(null);
    const [showFullReportModal, setShowFullReportModal] = useState(null);
    const [showOfferModal, setShowOfferModal] = useState(null);
    const [offerFormData, setOfferFormData] = useState({
        position: '',
        salary: '',
        startDate: '',
        department: '',
        reportingTo: '',
        benefits: '',
        contractType: 'full-time',
        location: '',
        notes: ''
    });
    const [finalRanking, setFinalRanking] = useState([]);
    const [shortlistedKeys, setShortlistedKeys] = useState(new Set());
    const finalRankingCacheRef = useRef(new Map());

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    const getStableTopScoreForApp = (app) => {
        const finalCandidates = app?.hrInterview || 0;
        if (finalCandidates <= 0) return 'N/A';

        const raw = `${app?.id ?? ''}-${app?.jobTitle ?? ''}`;
        let hash = 0;
        for (let i = 0; i < raw.length; i++) {
            hash = ((hash << 5) - hash) + raw.charCodeAt(i);
            hash |= 0;
        }

        const offset = Math.abs(hash) % 11; // 0..10
        return 85 + offset;
    };

    const getCandidateEmailForShortlist = (candidate) => {
        if (candidate?.email) return candidate.email;
        if (!candidate?.name) return '';
        return `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`;
    };

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

    const toggleCandidateShortlist = (candidate) => {
        const email = getCandidateEmailForShortlist(candidate);
        const shortlistData = {
            ...candidate,
            jobTitle: selectedApp?.jobTitle || 'Unknown Application',
            email,
            shortlistedFrom: 'Final Ranking',
            shortlistedDate: new Date().toISOString().slice(0, 10)
        };

        const existingShortlist = JSON.parse(localStorage.getItem('shortlist') || '[]');
        const candidateKey = getCandidateShortlistKey({ name: candidate?.name, email });
        const updatedShortlist = existingShortlist.filter(cv => getCandidateShortlistKey(cv) !== candidateKey);

        if (updatedShortlist.length === existingShortlist.length) {
            const shortlistNote = prompt(`Add a note for ${candidate?.name || 'this candidate'} (optional):`, '') || '';
            localStorage.setItem('shortlist', JSON.stringify([...existingShortlist, { ...shortlistData, shortlistNote }]));
        } else {
            localStorage.setItem('shortlist', JSON.stringify(updatedShortlist));
        }

        loadShortlistedKeys();
    };

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-600';
        if (score >= 85) return 'text-blue-600';
        if (score >= 80) return 'text-orange-600';
        return 'text-yellow-600';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Top Candidate': return 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800';
            case 'Strong Candidate': return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800';
            case 'Good Candidate': return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800';
            default: return 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800';
        }
    };

    const getRecommendationColor = (recommendation) => {
        switch (recommendation) {
            case 'Strongly Recommend': return 'bg-gradient-to-r from-green-500 to-emerald-600 text-white';
            case 'Recommend': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
            case 'Consider': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white';
            default: return 'bg-gradient-to-r from-slate-500 to-slate-600 text-white';
        }
    };

    const getHireProbabilityColor = (probability) => {
        if (probability >= 90) return 'bg-gradient-to-r from-green-500 to-green-600';
        if (probability >= 80) return 'bg-gradient-to-r from-blue-500 to-blue-600';
        if (probability >= 70) return 'bg-gradient-to-r from-orange-500 to-orange-600';
        return 'bg-gradient-to-r from-yellow-500 to-yellow-600';
    };

    const generateFinalRanking = (app) => {
        const candidates = [];
        const getNamePoolForApp = () => {
            const jobTitle = String(app?.jobTitle || '').toLowerCase();

            const softwarePool = [
                'Aya Yasser', 'Jomana Ahmed', 'Tarneed Khaled', 'Salma Omar',
                'Eman Hassan', 'Ahmed Ali', 'Yasser Mahmoud', 'Khaled Ibrahim',
                'Nour Fathy', 'Mariam Saeed', 'Omar Gamal', 'Hany Nabil',
                'Mostafa Farag', 'Heba Samir', 'Menna Hegazy', 'Hossam Shahin'
            ];

            const dataSciencePool = [
                'Aya Abdelrahman', 'Jomana Mostafa', 'Tarneed Younes', 'Salma Kamel',
                'Eman Hassan', 'Ahmed Saeed', 'Yasser Ali', 'Khaled Mahmoud',
                'Nour Ibrahim', 'Mariam Gamal', 'Omar Nabil', 'Hany Farag',
                'Mostafa Hegazy', 'Heba Shahin', 'Menna Fathy', 'Hossam Samir'
            ];

            const aiPool = [
                'Aya Hassan', 'Jomana Ibrahim', 'Tarneed Saeed', 'Salma Ali',
                'Eman Mahmoud', 'Ahmed Abdelrahman', 'Yasser Mostafa', 'Khaled Gamal',
                'Nour Nabil', 'Mariam Farag', 'Omar Kamel', 'Hany Shahin',
                'Mostafa Hegazy', 'Heba Samir', 'Menna Younes', 'Hossam Fathy'
            ];

            if (jobTitle.includes('data') || jobTitle.includes('science') || jobTitle.includes('analytics')) return dataSciencePool;
            if (jobTitle.includes('ai') || jobTitle.includes('ml') || jobTitle.includes('machine')) return aiPool;
            return softwarePool;
        };

        const names = getNamePoolForApp();

        const getAppOffset = () => {
            const raw = `${app?.id ?? ''}-${app?.jobTitle ?? ''}`;
            let hash = 0;
            for (let i = 0; i < raw.length; i++) {
                hash = ((hash << 5) - hash) + raw.charCodeAt(i);
                hash |= 0;
            }
            return Math.abs(hash);
        };

        const offset = getAppOffset();
        const count = Math.min(app.hrInterview || 0, 8);

        for (let i = 0; i < count; i++) {
            const semantic = 75 + Math.random() * 20;
            const technical = 75 + Math.random() * 20;
            const techInterview = 7 + Math.random() * 3;
            const hrInterview = 7.5 + Math.random() * 2.5;
            const overallScore = (semantic * 0.25 + technical * 0.25 + (techInterview * 10) * 0.25 + (hrInterview * 10) * 0.25);

            const recommendation = overallScore >= 90 ? 'Strongly Recommend' : overallScore >= 85 ? 'Recommend' : overallScore >= 80 ? 'Consider' : 'Review';
            const status = overallScore >= 90 ? 'Top Candidate' : overallScore >= 85 ? 'Strong Candidate' : overallScore >= 80 ? 'Good Candidate' : 'Needs Review';
            const hireProbability = Math.min(95, Math.round(overallScore - 5 + Math.random() * 10));

            candidates.push({
                id: i + 1,
                name: names[(i + offset) % names.length],
                overallScore: Math.round(overallScore),
                semantic: Math.round(semantic),
                technical: Math.round(technical),
                techInterview: parseFloat(techInterview.toFixed(1)),
                hrInterview: parseFloat(hrInterview.toFixed(1)),
                recommendation,
                status,
                experience: ['3 years', '4 years', '5 years', '6 years', '7 years', '8 years'][Math.floor(Math.random() * 6)],
                education: ['Bachelors in CS', 'Masters in CS', 'Bachelors in SE', 'Masters in EE'][Math.floor(Math.random() * 4)],
                skills: [
                    ['Python', 'ML', 'AWS', 'System Design', 'Leadership'],
                    ['Java', 'Spring', 'Microservices', 'Kubernetes', 'Docker'],
                    ['React', 'Node.js', 'TypeScript', 'AWS', 'Agile'],
                    ['C++', 'Algorithms', 'Embedded Systems', 'Python', 'Linux'],
                    ['Python', 'Django', 'PostgreSQL', 'Docker', 'REST APIs'],
                    ['JavaScript', 'Vue.js', 'MongoDB', 'Docker', 'GraphQL'],
                    ['Go', 'Kubernetes', 'gRPC', 'Prometheus', 'CI/CD'],
                    ['Ruby', 'Rails', 'MySQL', 'Redis', 'Sidekiq']
                ][Math.floor(Math.random() * 8)],
                notes: [
                    'Exceptional candidate with strong technical and leadership skills. Perfect cultural fit.',
                    'Solid technical skills with good communication. Shows great potential.',
                    'Excellent communicator with strong frontend skills. Quick learner.',
                    'Strong in low-level programming. Could grow into the role with mentorship.',
                    'Good foundation, shows enthusiasm. Would benefit from additional training.',
                    'Well-rounded candidate with good problem-solving abilities.',
                    'Experienced developer with strong architectural understanding.',
                    'Creative problem solver with excellent teamwork skills.'
                ][Math.floor(Math.random() * 8)],
                hireProbability
            });
        }

        return candidates.sort((a, b) => b.overallScore - a.overallScore);
    };

    useEffect(() => {
        if (!selectedAppId) {
            setFinalRanking([]);
            return;
        }

        const cached = finalRankingCacheRef.current.get(selectedAppId);
        if (cached) {
            setFinalRanking(cached);
            return;
        }

        if (selectedApp) {
            const generated = generateFinalRanking(selectedApp);
            finalRankingCacheRef.current.set(selectedAppId, generated);
            setFinalRanking(generated);
        } else {
            setFinalRanking([]);
        }
    }, [selectedAppId, selectedApp]);

    const hiringStats = useMemo(() => {
        if (finalRanking.length === 0) {
            return {
                totalCandidates: 0,
                shortlisted: 0,
                finalists: 0,
                avgOverallScore: 0,
                topScore: 0,
                offerAcceptanceRate: 0
            };
        }

        const totalCandidates = finalRanking.length;
        const shortlisted = finalRanking.filter(c => c.overallScore >= 85).length;
        const finalists = finalRanking.filter(c => c.overallScore >= 80).length;
        const avgOverallScore = Math.round(finalRanking.reduce((sum, c) => sum + c.overallScore, 0) / totalCandidates);
        const topScore = Math.max(...finalRanking.map(c => c.overallScore));
        const offerAcceptanceRate = Math.min(95, 85 + Math.round((avgOverallScore - 75) * 0.5));

        return {
            totalCandidates,
            shortlisted,
            finalists,
            avgOverallScore,
            topScore,
            offerAcceptanceRate
        };
    }, [finalRanking]);

    const stageScores = useMemo(() => {
        if (finalRanking.length === 0) {
            return {
                semantic: { avg: 0, max: 0, min: 0 },
                technical: { avg: 0, max: 0, min: 0 },
                techInterview: { avg: 0, max: 0, min: 0 },
                hrInterview: { avg: 0, max: 0, min: 0 }
            };
        }

        const semanticScores = finalRanking.map(c => c.semantic);
        const technicalScores = finalRanking.map(c => c.technical);
        const techInterviewScores = finalRanking.map(c => c.techInterview);
        const hrInterviewScores = finalRanking.map(c => c.hrInterview);

        return {
            semantic: {
                avg: Math.round(semanticScores.reduce((sum, s) => sum + s, 0) / semanticScores.length),
                max: Math.max(...semanticScores),
                min: Math.min(...semanticScores)
            },
            technical: {
                avg: Math.round(technicalScores.reduce((sum, s) => sum + s, 0) / technicalScores.length),
                max: Math.max(...technicalScores),
                min: Math.min(...technicalScores)
            },
            techInterview: {
                avg: parseFloat((techInterviewScores.reduce((sum, s) => sum + s, 0) / techInterviewScores.length).toFixed(1)),
                max: Math.max(...techInterviewScores),
                min: Math.min(...techInterviewScores)
            },
            hrInterview: {
                avg: parseFloat((hrInterviewScores.reduce((sum, s) => sum + s, 0) / hrInterviewScores.length).toFixed(1)),
                max: Math.max(...hrInterviewScores),
                min: Math.min(...hrInterviewScores)
            }
        };
    }, [finalRanking]);

    const filteredCandidates = useMemo(() => {
        let filtered = finalRanking;

        if (selectedFilter !== 'all') {
            filtered = filtered.filter(candidate => {
                if (selectedFilter === 'top') return candidate.recommendation === 'Strongly Recommend';
                if (selectedFilter === 'recommended') return candidate.recommendation === 'Recommend';
                if (selectedFilter === 'consider') return candidate.recommendation === 'Consider';
                return true;
            });
        }

        return [...filtered].sort((a, b) => {
            if (sortBy === 'overallScore') return b.overallScore - a.overallScore;
            if (sortBy === 'technical') return b.technical - a.technical;
            if (sortBy === 'hrInterview') return b.hrInterview - a.hrInterview;
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return 0;
        });
    }, [finalRanking, selectedFilter, sortBy]);

    const generateFullReport = (candidate) => {
        const candidateIndex = finalRanking.findIndex(c => c.id === candidate.id);
        return {
            personalInfo: {
                name: candidate.name,
                email: `${candidate.name.toLowerCase().replace(' ', '.')}@email.com`,
                phone: `+1 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
                location: 'San Francisco, CA',
                experience: candidate.experience,
                education: candidate.education
            },
            overallPerformance: {
                overallScore: candidate.overallScore,
                rank: candidateIndex + 1,
                totalCandidates: finalRanking.length,
                percentile: Math.round(((finalRanking.length - candidateIndex) / finalRanking.length) * 100),
                status: candidate.status,
                recommendation: candidate.recommendation,
                hireProbability: candidate.hireProbability
            },
            stageBreakdown: {
                semantic: { score: candidate.semantic },
                technical: { score: candidate.technical },
                techInterview: { score: candidate.techInterview },
                hrInterview: { score: candidate.hrInterview }
            },
            generatedDate: new Date().toISOString()
        };
    };

    const downloadReport = () => {
        const reportData = {
            candidates: filteredCandidates.map((c, index) => ({
                rank: index + 1,
                name: c.name,
                overallScore: c.overallScore,
                semantic: c.semantic,
                technical: c.technical,
                hrInterview: c.hrInterview,
                techInterview: c.techInterview,
                status: c.status,
                recommendation: c.recommendation,
                hireProbability: c.hireProbability
            })),
            stats: {
                totalCandidates: finalRanking.length,
                filteredCandidates: filteredCandidates.length,
                selectedFilter: selectedFilter,
                sortBy: sortBy
            },
            generatedDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `final-ranking-report-${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const downloadCV = (candidate) => {
        const report = generateFullReport(candidate);
        const cvData = {
            personalInfo: report.personalInfo,
            overallPerformance: report.overallPerformance,
            stageBreakdown: report.stageBreakdown,
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

    const downloadPDF = (candidate) => {
        const report = generateFullReport(candidate);
        const pdfData = {
            ...report,
            generatedDate: new Date().toISOString(),
            format: 'PDF'
        };

        const dataStr = JSON.stringify(pdfData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `candidate-report-${candidate.name.replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.json`;
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const extendOffer = (candidate) => {
        setShowOfferModal(candidate);
        setOfferFormData({
            position: selectedApp?.jobTitle || 'Software Engineer',
            salary: '',
            startDate: '',
            department: 'Engineering',
            reportingTo: '',
            benefits: 'Health insurance, 401(k), unlimited PTO, gym membership',
            contractType: 'full-time',
            location: 'San Francisco, CA (Remote/Hybrid)',
            notes: `Offer extended to ${candidate.name} based on strong performance across all evaluation stages.`
        });
    };

    const scheduleFollowUp = (candidate) => {
        const date = prompt(`Schedule follow-up for ${candidate.name}. Enter date (YYYY-MM-DD):`, new Date().toISOString().split('T')[0]);
        if (date) {
            alert(`Follow-up scheduled for ${candidate.name} on ${date}`);
        }
    };

    const makeFinalSelection = () => {
        const topCandidates = filteredCandidates.slice(0, 3).map(c => ({
            name: c.name,
            overallScore: c.overallScore,
            rank: filteredCandidates.indexOf(c) + 1,
            recommendation: c.recommendation,
            status: 'Selected for Final Consideration'
        }));

        const dataStr = JSON.stringify(topCandidates, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = `final-selection-${new Date().toISOString().split('T')[0]}.json`;
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
                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-16 h-16 rounded-lg mr-4">
                                <Trophy className="w-8 h-8 text-white" />
                            </div>
                            <div className="ml-6">
                                <h1 className={`text-4xl font-bold transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Final Ranking</h1>
                                <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Comprehensive candidate evaluation and ranking</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                    <h2 className={`text-xl font-bold mb-4 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => {
                            const finalCandidates = app.hrInterview || 0;
                            return (
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
                                            <div>Final Candidates: {finalCandidates}</div>
                                            <div>Top Score: {getStableTopScoreForApp(app)}</div>
                                            <div>Status: {finalCandidates > 0 ? 'Ready' : 'Pending'}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedApp ? (
                    <div>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-accent-600 mb-2">{hiringStats.finalists}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Final Candidates</div>
                                    </div>
                                    <Trophy className="w-10 h-10 text-accent-400" />
                                </div>
                                <div className={`mt-3 text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Selected from {hiringStats.totalCandidates} applicants</div>
                            </div>

                            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-accent-600 mb-2">{hiringStats.topScore}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Top Score</div>
                                    </div>
                                    <Star className="w-10 h-10 text-accent-400" />
                                </div>
                                <div className={`mt-3 text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Overall maximum score achieved</div>
                            </div>

                            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-50 to-accent-50 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-accent-600 mb-2">{hiringStats.avgOverallScore}</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Average Score</div>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-accent-400" />
                                </div>
                                <div className={`mt-3 text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Across all final candidates</div>
                            </div>

                            <div className={`rounded-2xl shadow-lg p-6 transition-colors ${isDarkMode ? 'bg-slate-700 shadow-slate-900' : 'bg-gradient-to-br from-base-100 to-accent-100 shadow-base-200'}`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className={`text-3xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-600'}`}>{hiringStats.offerAcceptanceRate}%</div>
                                        <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Acceptance Rate</div>
                                    </div>
                                    <Heart className="w-10 h-10 text-accent-400" />
                                </div>
                                <div className={`mt-3 text-xs transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-500'}`}>Estimated offer acceptance probability</div>
                            </div>
                        </div>

                        {/* Stage Performance */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <h2 className={`text-2xl font-bold mb-6 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Stage Performance Analysis</h2>

                            <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                Range: {stageScores.semantic.min} - {stageScores.semantic.max}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className={`p-6 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-accent-600">{stageScores.semantic.avg}</div>
                                            <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Semantic Analysis</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                                            <Code className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-accent-600">{stageScores.technical.avg}</div>
                                            <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Technical Test</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-accent-600">{stageScores.techInterview.avg}</div>
                                            <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>Tech Interview</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-100 to-accent-100'}`}>
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-gradient-to-r from-base-500 to-accent-500 rounded-lg flex items-center justify-center mr-4">
                                            <MessageSquare className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-600'}`}>{stageScores.hrInterview.avg}</div>
                                            <div className={`text-sm transition-colors ${isDarkMode ? 'text-gray-300' : 'text-base-600'}`}>HR Interview</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Header and Controls */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                            <div>
                                <h2 className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Final Candidates Ranking</h2>
                                <p className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Ranked by overall performance across all stages</p>
                            </div>

                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                <div className="flex items-center space-x-2">
                                    <Filter className={`w-5 h-5 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`} />
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) => setSelectedFilter(e.target.value)}
                                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors duration-300 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-base-300 text-base-700'}`}
                                    >
                                        <option value="all">All Candidates</option>
                                        <option value="top">Top Candidates</option>
                                        <option value="recommended">Recommended</option>
                                        <option value="consider">Consider</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <span className={`transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Sort by:</span>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className={`border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors duration-300 ${isDarkMode ? 'border-slate-600 bg-slate-700 text-gray-200' : 'border-base-300 text-base-700'}`}
                                    >
                                        <option value="overallScore">Overall Score</option>
                                        <option value="technical">Technical Score</option>
                                        <option value="hrInterview">HR Score</option>
                                        <option value="name">Name</option>
                                        <option value="experience">Experience</option>
                                    </select>
                                </div>

                                <button
                                    onClick={downloadReport}
                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Export Report
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {filteredCandidates.map((candidate, index) => (
                                <div
                                    key={candidate.id}
                                    className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${index === 0 ?
                                        isDarkMode ? 'border-yellow-500 bg-slate-800' : 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' :
                                        index === 1 ?
                                            isDarkMode ? 'border-blue-500 bg-slate-800' : 'border-blue-300 bg-gradient-to-r from-blue-50 to-sky-50' :
                                            index === 2 ?
                                                isDarkMode ? 'border-green-500 bg-slate-800' : 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
                                                isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-200 bg-white'
                                        }`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                                        <div className="flex items-start mb-4 lg:mb-0">
                                            <div className={`relative flex-shrink-0 ${index === 0 ? 'w-16 h-16' : 'w-14 h-14'}`}>
                                                <div className={`w-full h-full rounded-xl flex items-center justify-center font-bold ${index === 0 ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white text-2xl' :
                                                    index === 1 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xl' :
                                                        index === 2 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xl' :
                                                            'bg-gradient-to-br from-slate-500 to-slate-600 text-white'
                                                    }`}>
                                                    {index + 1}
                                                    {index < 3 && (
                                                        <div className="absolute -top-2 -right-2">
                                                            <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-400' :
                                                                index === 1 ? 'text-blue-400' :
                                                                    'text-green-400'
                                                                }`} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="ml-4">
                                                <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{candidate.name}</h3>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(candidate.status)}`}>
                                                        {candidate.status}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getRecommendationColor(candidate.recommendation)}`}>
                                                        {candidate.recommendation}
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getHireProbabilityColor(candidate.hireProbability)} text-white`}>
                                                        {candidate.hireProbability}% Hire Probability
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <div className={`text-center px-4 py-2 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                                <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Score</div>
                                                <div className={`text-3xl font-bold ${getScoreColor(candidate.overallScore)}`}>{candidate.overallScore}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        <div className={`p-4 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Semantic Analysis</div>
                                            <div className="text-2xl font-bold text-accent-600">{candidate.semantic}</div>
                                            <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>Match Score</div>
                                        </div>

                                        <div className={`p-4 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Test</div>
                                            <div className="text-2xl font-bold text-accent-600">{candidate.technical}</div>
                                            <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>Technical Score</div>
                                        </div>

                                        <div className={`p-4 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Tech Interview</div>
                                            <div className="text-2xl font-bold text-accent-600">{candidate.techInterview}</div>
                                            <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>/10 Rating</div>
                                        </div>

                                        <div className={`p-4 rounded-xl transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-100 to-accent-100'}`}>
                                            <div className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>HR Interview</div>
                                            <div className={`text-2xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-600'}`}>{candidate.hrInterview}</div>
                                            <div className={`text-xs transition-colors duration-300 ${isDarkMode ? 'text-gray-500' : 'text-base-500'}`}>/10 Rating</div>
                                        </div>
                                    </div>

                                    {/* Skills and Notes */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Key Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {candidate.skills.map((skill, skillIndex) => (
                                                    <span
                                                        key={skillIndex}
                                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-slate-600 text-gray-200 hover:bg-slate-500' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700 hover:from-base-200 hover:to-accent-200'}`}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className={`text-lg font-semibold mb-3 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Evaluation Notes</h4>
                                            <p className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'text-gray-400 bg-slate-700' : 'text-base-600 bg-base-50'}`}>{candidate.notes}</p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className={`flex flex-wrap justify-between items-center pt-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-base-200'}`}>
                                        <div className="flex items-center space-x-4">
                                            <button
                                                onClick={() => toggleCandidateShortlist(candidate)}
                                                className={`font-semibold flex items-center transition-colors duration-300 ${isDarkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-800'}`}
                                            >
                                                <Star
                                                    className="w-5 h-5 mr-2"
                                                    fill={shortlistedKeys.has(getCandidateShortlistKey({ name: candidate?.name, email: getCandidateEmailForShortlist(candidate) })) ? 'currentColor' : 'none'}
                                                />
                                                {shortlistedKeys.has(getCandidateShortlistKey({ name: candidate?.name, email: getCandidateEmailForShortlist(candidate) })) ? 'Remove from Shortlist' : 'Add to Shortlist'}
                                            </button>
                                            <button
                                                onClick={() => setShowCVModal(candidate)}
                                                className={`font-semibold flex items-center transition-colors duration-300 ${isDarkMode ? 'text-gray-300 hover:text-gray-100' : 'text-base-600 hover:text-base-800'}`}
                                            >
                                                <FileText className="w-5 h-5 mr-2" />
                                                View CV
                                            </button>
                                            <button
                                                onClick={() => setShowFullReportModal(candidate)}
                                                className={`font-semibold flex items-center transition-colors duration-300 ${isDarkMode ? 'text-accent-400 hover:text-accent-300' : 'text-accent-600 hover:text-accent-800'}`}
                                            >
                                                <FileText className="w-5 h-5 mr-2" />
                                                Full Report
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                            <button
                                                onClick={() => scheduleFollowUp(candidate)}
                                                className={`border-2 px-6 py-3 rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                            >
                                                Schedule Follow-up
                                            </button>
                                            <button
                                                onClick={() => extendOffer(candidate)}
                                                className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center"
                                            >
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Extend Offer
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Comparative Analysis */}
                        <div className={`rounded-2xl shadow-lg p-6 mb-8 mt-8 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                            <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Comparative Analysis</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Score Distribution */}
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Score Distribution</h3>
                                    <div className="space-y-4">
                                        {filteredCandidates.map((candidate) => (
                                            <div key={candidate.id} className="flex items-center">
                                                <div className={`w-32 text-sm font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-700'}`}>{candidate.name}</div>
                                                <div className="flex-1 ml-4">
                                                    <div className="relative h-8 rounded-lg overflow-hidden">
                                                        <div className={`absolute inset-0 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 'bg-gradient-to-r from-base-100 to-base-200'}`}></div>
                                                        <div
                                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-base-500 to-accent-500 transition-all duration-1000"
                                                            style={{ width: `${candidate.overallScore}%` }}
                                                        />
                                                        <div className={`absolute inset-0 flex items-center justify-center text-xs font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                                            {candidate.overallScore}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Recommendations Summary */}
                                <div>
                                    <h3 className={`text-lg font-semibold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Recommendation Summary</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className={`p-6 rounded-xl text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                                {filteredCandidates.filter(c => c.recommendation === 'Strongly Recommend').length}
                                            </div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Strongly Recommend</div>
                                        </div>
                                        <div className={`p-6 rounded-xl text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-50 to-accent-50'}`}>
                                            <div className="text-3xl font-bold text-accent-600 mb-2">
                                                {filteredCandidates.filter(c => c.recommendation === 'Recommend').length}
                                            </div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Recommend</div>
                                        </div>
                                        <div className={`p-6 rounded-xl text-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-gradient-to-br from-base-100 to-accent-100'}`}>
                                            <div className={`text-3xl font-bold mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-200' : 'text-base-600'}`}>
                                                {filteredCandidates.filter(c => c.recommendation === 'Consider').length}
                                            </div>
                                            <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Consider</div>
                                        </div>
                                    </div>

                                    <div className={`mt-6 p-4 rounded-xl border transition-colors duration-300 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-gradient-to-r from-base-50 to-accent-50 border-base-200'}`}>
                                        <div className="flex items-center">
                                            <CheckCircle className="w-6 h-6 text-accent-600 mr-3" />
                                            <div>
                                                <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Ready for Hiring Decision</h4>
                                                <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                                    All {filteredCandidates.length} candidates have completed all evaluation stages and are ready for final hiring decisions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Actions */}
                        <div className="flex justify-end space-x-4 mt-8">
                            <button
                                onClick={() => alert('Ranking saved for later!')}
                                className={`px-8 py-4 border-2 rounded-xl font-semibold transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                            >
                                Save for Later
                            </button>
                            <button
                                onClick={makeFinalSelection}
                                className="px-8 py-4 bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white rounded-xl font-semibold transition-all flex items-center"
                            >
                                <CheckCircle className="w-6 h-6 mr-3" />
                                Make Final Selection
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={`text-center py-16 rounded-2xl shadow-lg transition-colors ${isDarkMode ? 'bg-slate-800 shadow-slate-900' : 'bg-white shadow-base-200'}`}>
                        <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className={`text-2xl font-bold mb-2 transition-colors ${isDarkMode ? 'text-white' : 'text-base-900'}`}>No Application Selected</h3>
                        <p className={`transition-colors ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Please select an application to view the final ranking</p>
                    </div>
                )}
            </div>

            {/* CV Modal */}
            {showCVModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {showCVModal.name}
                                    </h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Candidate Profile
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowCVModal(null)}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Candidate Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Score</div>
                                            <div className="text-3xl font-bold text-accent-600">{showCVModal.overallScore}</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Experience</div>
                                            <div className="text-lg font-semibold">{showCVModal.experience}</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Education</div>
                                            <div className="text-lg font-semibold">{showCVModal.education}</div>
                                        </div>
                                        <div>
                                            <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Status</div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-bold ${getStatusColor(showCVModal.status)}`}>
                                                {showCVModal.status}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Assessment Scores</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-accent-600">{showCVModal.semantic}</div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Semantic Analysis</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-accent-600">{showCVModal.technical}</div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Assessment</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-accent-600">{showCVModal.techInterview}</div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Technical Interview</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-accent-600">{showCVModal.hrInterview}</div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>HR Interview</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {showCVModal.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${isDarkMode ? 'bg-slate-600 text-gray-200' : 'bg-gradient-to-r from-base-100 to-accent-100 text-accent-700'}`}
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Evaluation Notes</h3>
                                    <p className={`${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>{showCVModal.notes}</p>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    onClick={() => downloadCV(showCVModal)}
                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download CV
                                </button>
                                <button
                                    onClick={() => setShowCVModal(null)}
                                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Full Report Modal */}
            {showFullReportModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        {showFullReportModal.name} - Full Report
                                    </h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Comprehensive Candidate Analysis Report
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowFullReportModal(null)}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <div className="space-y-8">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Overall Performance</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-accent-600">{showFullReportModal.overallScore}</div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Overall Score</p>
                                        </div>
                                        <div className="text-center">
                                            <div className={`px-4 py-2 rounded-lg font-bold ${getRecommendationColor(showFullReportModal.recommendation)}`}>
                                                {showFullReportModal.recommendation}
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Recommendation</p>
                                        </div>
                                        <div className="text-center">
                                            <div className={`px-4 py-2 rounded-lg font-bold ${getHireProbabilityColor(showFullReportModal.hireProbability)}`}>
                                                {showFullReportModal.hireProbability}%
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Hire Probability</p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Stage Breakdown</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Sparkles className="w-5 h-5 mr-3 text-accent-600" />
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Semantic Analysis</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="font-bold text-accent-600">{showFullReportModal.semantic}/100</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Excellent keyword matching and experience alignment</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Code className="w-5 h-5 mr-3 text-accent-600" />
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Technical Assessment</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="font-bold text-accent-600">{showFullReportModal.technical}/100</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Strong problem-solving and coding abilities</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Users className="w-5 h-5 mr-3 text-accent-600" />
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Technical Interview</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="font-bold text-accent-600">{showFullReportModal.techInterview}/10</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Clear communication and technical depth</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <Heart className="w-5 h-5 mr-3 text-accent-600" />
                                                <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-base-900'}`}>HR Interview</span>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="text-right">
                                                    <div className="font-bold text-accent-600">{showFullReportModal.hrInterview}/10</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Great cultural fit and team alignment</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Skills Assessment</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Technical Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {showFullReportModal.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-accent-500/20 text-accent-400' : 'bg-accent-100 text-accent-700'}`}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Soft Skills</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Adaptability'].map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className={`px-3 py-1 rounded-lg text-sm font-medium ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Detailed Feedback</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className={`font-semibold mb-3 text-green-600`}>Strengths</h4>
                                            <ul className="space-y-2">
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Strong technical foundation across multiple technologies</li>
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Excellent problem-solving and analytical skills</li>
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Great communication and presentation abilities</li>
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Proven track record of delivering high-quality work</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className={`font-semibold mb-3 text-orange-600`}>Areas for Improvement</h4>
                                            <ul className="space-y-2">
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Could benefit from more leadership experience</li>
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• Advanced architecture knowledge could be strengthened</li>
                                                <li className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>• More exposure to large-scale systems would be beneficial</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-700' : 'bg-base-50'}`}>
                                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>Recommendations</h3>
                                    <div className="space-y-3">
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>Consider for senior technical role</p>
                                        </div>
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Strong candidate for team lead position</p>
                                        </div>
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Excellent fit for company culture and values</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 mt-8">
                                <button
                                    onClick={() => downloadPDF(showFullReportModal)}
                                    className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-6 py-3 rounded-lg font-semibold transition-all flex items-center"
                                >
                                    <Download className="w-5 h-5 mr-2" />
                                    Download Full Report
                                </button>
                                <button
                                    onClick={() => setShowFullReportModal(null)}
                                    className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Offer Form Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                        Extend Offer to {showOfferModal.name}
                                    </h2>
                                    <p className={`${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>
                                        Fill in the offer details to send to the candidate
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowOfferModal(null)}
                                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-gray-400' : 'hover:bg-base-100 text-base-600'}`}
                                >
                                    <span className="text-2xl">×</span>
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault();
                                // Handle form submission
                                const offerDetails = {
                                    candidate: showOfferModal.name,
                                    ...offerFormData,
                                    sentDate: new Date().toISOString()
                                };

                                // Store offer in localStorage
                                const existingOffers = JSON.parse(localStorage.getItem('offers') || '[]');
                                localStorage.setItem('offers', JSON.stringify([...existingOffers, offerDetails]));

                                alert(`Offer successfully sent to ${showOfferModal.name}!`);
                                setShowOfferModal(null);
                                setOfferFormData({
                                    position: '',
                                    salary: '',
                                    startDate: '',
                                    department: '',
                                    reportingTo: '',
                                    benefits: '',
                                    contractType: 'full-time',
                                    location: '',
                                    notes: ''
                                });
                            }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Position Title
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={offerFormData.position}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, position: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="e.g. Senior Software Engineer"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Salary/Compensation
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={offerFormData.salary}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, salary: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="e.g. $120,000 - $150,000"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={offerFormData.startDate}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, startDate: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Department
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={offerFormData.department}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, department: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="e.g. Engineering"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Contract Type
                                        </label>
                                        <select
                                            value={offerFormData.contractType}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, contractType: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                        >
                                            <option value="full-time">Full-time</option>
                                            <option value="part-time">Part-time</option>
                                            <option value="contract">Contract</option>
                                            <option value="internship">Internship</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={offerFormData.location}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, location: e.target.value })}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="e.g. San Francisco, CA (Remote/Hybrid)"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Benefits & Perks
                                        </label>
                                        <textarea
                                            value={offerFormData.benefits}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, benefits: e.target.value })}
                                            rows={3}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="e.g. Health insurance, 401(k), unlimited PTO, gym membership, etc."
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-base-700'}`}>
                                            Additional Notes
                                        </label>
                                        <textarea
                                            value={offerFormData.notes}
                                            onChange={(e) => setOfferFormData({ ...offerFormData, notes: e.target.value })}
                                            rows={3}
                                            className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${isDarkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-base-300 bg-white text-base-900'}`}
                                            placeholder="Any additional information or special conditions for this offer..."
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-slate-600">
                                    <button
                                        type="button"
                                        onClick={() => setShowOfferModal(null)}
                                        className={`px-6 py-3 border-2 rounded-lg font-semibold transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-base-300 text-base-600 hover:bg-base-50'}`}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center"
                                    >
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Send Offer
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}