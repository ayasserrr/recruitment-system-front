import React, { useState, useMemo, useEffect } from 'react';
import { Award, ChevronRight, Eye, Download, Filter, Star, TrendingUp, Trophy, CheckCircle, Users, BarChart, Target, Crown, Heart, Sparkles, ArrowLeft, Briefcase, FileText, Calendar, Clock, Award as AwardIcon, User, Mail, Phone, MapPin, Code, MessageSquare, Brain } from 'lucide-react';

export default function FinalRanking({ applications, onBack }) {
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [sortBy, setSortBy] = useState('overallScore');
    const [showCVModal, setShowCVModal] = useState(null);
    const [showFullReportModal, setShowFullReportModal] = useState(null);
    const [finalRanking, setFinalRanking] = useState([]);

    const selectedApp = useMemo(() => applications.find(a => a.id === selectedAppId), [applications, selectedAppId]);

    // Custom GraduationCap icon component
    const GraduationCap = ({ className }) => (
        <svg
            className={className}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l9-5-9-5-9 5 9 5z"
            />
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
            />
        </svg>
    );

    // Helper functions
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

    // Generate final ranking data per application
    const generateFinalRanking = (app) => {
        const candidates = [];
        const names = ['Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Brown', 'Alex Rodriguez', 'Priya Sharma', 'David Kim', 'Lisa Wang'];
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
                name: names[i % names.length],
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

    // Update final ranking when app changes
    useEffect(() => {
        if (selectedApp) {
            setFinalRanking(generateFinalRanking(selectedApp));
        } else {
            setFinalRanking([]);
        }
    }, [selectedApp]);

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

    const mockCV = {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 234 567 8900',
        summary: 'Experienced software engineer with 5+ years in full-stack development.',
        experience: '5 years',
        education: 'Bachelor of Computer Science',
        projects: ['E-commerce Platform', 'Mobile Banking App', 'AI Chatbot']
    };

    // Generate full report data
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
                semantic: {
                    score: candidate.semantic,
                    strengths: ['Strong technical vocabulary', 'Clear communication', 'Relevant experience keywords'],
                    areas: ['Could improve industry-specific terminology'],
                    details: 'Candidate demonstrates excellent semantic matching with job requirements, showing strong alignment in technical skills and experience.'
                },
                technical: {
                    score: candidate.technical,
                    strengths: ['Problem solving', 'Code quality', 'Algorithm knowledge'],
                    areas: ['Advanced data structures'],
                    details: 'Solid technical foundation with good problem-solving abilities. Shows promise in complex coding challenges.'
                },
                techInterview: {
                    score: candidate.techInterview,
                    strengths: ['System design', 'Communication', 'Technical depth'],
                    areas: ['Architecture patterns'],
                    details: 'Excellent technical interview performance. Demonstrates strong understanding of system design principles and communicates technical concepts clearly.'
                },
                hrInterview: {
                    score: candidate.hrInterview,
                    strengths: ['Cultural fit', 'Team collaboration', 'Leadership potential'],
                    areas: ['Conflict resolution'],
                    details: 'Strong cultural alignment with company values. Shows excellent teamwork skills and leadership potential.'
                }
            },
            skillsAssessment: {
                technical: candidate.skills.filter(skill => ['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AWS', 'Docker', 'MongoDB'].includes(skill)),
                soft: ['Communication', 'Teamwork', 'Problem Solving', 'Leadership', 'Adaptability'],
                domain: candidate.skills.filter(skill => ['FinTech', 'Healthcare', 'E-commerce', 'SaaS'].includes(skill))
            },
            detailedFeedback: {
                strengths: [
                    'Strong technical foundation across multiple technologies',
                    'Excellent problem-solving and analytical skills',
                    'Great communication and presentation abilities',
                    'Proven track record of delivering high-quality work'
                ],
                improvements: [
                    'Could benefit from more leadership experience',
                    'Advanced architecture knowledge could be strengthened',
                    'More exposure to large-scale systems would be beneficial'
                ],
                recommendations: [
                    'Consider for senior technical role',
                    'Strong candidate for team lead position',
                    'Excellent fit for company culture and values'
                ]
            },
            interviewDetails: {
                technicalInterview: {
                    date: '2025-12-10',
                    duration: '60 minutes',
                    interviewers: ['John Smith (Tech Lead)', 'Sarah Johnson (Senior Engineer)'],
                    questions: [
                        'Design a scalable microservices architecture',
                        'Solve a complex algorithm problem',
                        'Discuss your approach to system optimization'
                    ],
                    feedback: 'Excellent technical depth and problem-solving approach. Clear communication of complex concepts.'
                },
                hrInterview: {
                    date: '2025-12-11',
                    duration: '45 minutes',
                    interviewers: ['Emily Davis (HR Manager)', 'Michael Brown (Team Lead)'],
                    questions: [
                        'Describe your ideal work environment',
                        'How do you handle team conflicts?',
                        'Where do you see yourself in 5 years?'
                    ],
                    feedback: 'Strong cultural fit. Demonstrates excellent teamwork and leadership potential.'
                }
            },
            comparison: {
                vsAverage: {
                    semantic: candidate.semantic - (stageScores.semantic.avg || 0),
                    technical: candidate.technical - (stageScores.technical.avg || 0),
                    techInterview: candidate.techInterview - (stageScores.techInterview.avg || 0),
                    hrInterview: candidate.hrInterview - (stageScores.hrInterview.avg || 0)
                },
                vsTop: {
                    semantic: candidate.semantic - (stageScores.semantic.max || 0),
                    technical: candidate.technical - (stageScores.technical.max || 0),
                    techInterview: candidate.techInterview - (stageScores.techInterview.max || 0),
                    hrInterview: candidate.hrInterview - (stageScores.hrInterview.max || 0)
                }
            }
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {onBack && (
                                <button onClick={onBack} className="mr-4 p-2 hover:bg-white rounded-lg transition-colors">
                                    <ArrowLeft className="w-6 h-6 text-slate-600" />
                                </button>
                            )}
                            <div className="relative">
                                <Award className="w-16 h-16 text-yellow-600" />
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                    <Crown className="w-4 h-4 text-white" />
                                </div>
                            </div>
                            <div className="ml-6">
                                <h1 className="text-4xl font-bold text-slate-800">Final Candidate Ranking</h1>
                                <p className="text-slate-600">Comprehensive evaluation and ranking of top candidates</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Application Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4">Select Application</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {applications.map(app => {
                            const finalCandidates = app.hrInterview || 0;
                            return (
                                <button
                                    key={app.id}
                                    onClick={() => setSelectedAppId(app.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedAppId === app.id
                                        ? 'border-yellow-500 bg-yellow-50'
                                        : 'border-slate-200 hover:border-yellow-300'
                                        }`}
                                >
                                    <div className="text-left">
                                        <h3 className="font-bold text-slate-800">{app.jobTitle}</h3>
                                        <div className="text-sm text-slate-600 mt-1">
                                            <div>Final Candidates: {finalCandidates}</div>
                                            <div>Top Score: {finalCandidates > 0 ? Math.round(85 + Math.random() * 10) : 'N/A'}</div>
                                            <div>Status: {finalCandidates > 0 ? 'Ready' : 'Pending'}</div>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {selectedApp ? (
                    <>
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-yellow-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-yellow-600 mb-2">{hiringStats.finalists}</div>
                                        <div className="text-sm text-slate-600">Final Candidates</div>
                                    </div>
                                    <Trophy className="w-10 h-10 text-yellow-400" />
                                </div>
                                <div className="mt-3 text-xs text-slate-500">Selected from {hiringStats.totalCandidates} applicants</div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-green-600 mb-2">{hiringStats.topScore}</div>
                                        <div className="text-sm text-slate-600">Top Score</div>
                                    </div>
                                    <Star className="w-10 h-10 text-green-400" />
                                </div>
                                <div className="mt-3 text-xs text-slate-500">Overall maximum score achieved</div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-blue-600 mb-2">{hiringStats.avgOverallScore}</div>
                                        <div className="text-sm text-slate-600">Average Score</div>
                                    </div>
                                    <TrendingUp className="w-10 h-10 text-blue-400" />
                                </div>
                                <div className="mt-3 text-xs text-slate-500">Across all final candidates</div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-3xl font-bold text-purple-600 mb-2">{hiringStats.offerAcceptanceRate}%</div>
                                        <div className="text-sm text-slate-600">Acceptance Rate</div>
                                    </div>
                                    <Heart className="w-10 h-10 text-purple-400" />
                                </div>
                                <div className="mt-3 text-xs text-slate-500">Estimated offer acceptance probability</div>
                            </div>
                        </div>

                        {/* Stage Performance */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                                <BarChart className="w-6 h-6 mr-3 text-yellow-600" />
                                Stage Performance Analysis
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-purple-600">{stageScores.semantic.avg}</div>
                                            <div className="text-sm text-slate-600">Semantic Analysis</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Range: {stageScores.semantic.min} - {stageScores.semantic.max}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center mr-4">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-orange-600">{stageScores.technical.avg}</div>
                                            <div className="text-sm text-slate-600">Technical Test</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Range: {stageScores.technical.min} - {stageScores.technical.max}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-red-600">{stageScores.techInterview.avg}/10</div>
                                            <div className="text-sm text-slate-600">Tech Interview</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Range: {stageScores.techInterview.min} - {stageScores.techInterview.max}/10
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
                                    <div className="flex items-center mb-4">
                                        <div className="w-12 h-12 bg-pink-600 rounded-lg flex items-center justify-center mr-4">
                                            <Users className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-pink-600">{stageScores.hrInterview.avg}/10</div>
                                            <div className="text-sm text-slate-600">HR Interview</div>
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-600">
                                        Range: {stageScores.hrInterview.min} - {stageScores.hrInterview.max}/10
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters and Controls */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">Final Candidates Ranking</h2>
                                    <p className="text-slate-600">Ranked by overall performance across all stages</p>
                                </div>

                                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                    <div className="flex items-center space-x-2">
                                        <Filter className="w-5 h-5 text-slate-600" />
                                        <select
                                            value={selectedFilter}
                                            onChange={(e) => setSelectedFilter(e.target.value)}
                                            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        >
                                            <option value="all">All Candidates</option>
                                            <option value="top">Top Candidates</option>
                                            <option value="recommended">Recommended</option>
                                            <option value="consider">Consider</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-slate-600">Sort by:</span>
                                        <select
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            className="border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        >
                                            <option value="overallScore">Overall Score</option>
                                            <option value="technical">Technical Score</option>
                                            <option value="hrInterview">HR Score</option>
                                            <option value="name">Name</option>
                                        </select>
                                    </div>

                                    <button
                                        onClick={() => alert('Export report functionality would be implemented here')}
                                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center"
                                    >
                                        <Download className="w-5 h-5 mr-2" />
                                        Export Report
                                    </button>
                                </div>
                            </div>

                            {/* Candidates Ranking */}
                            <div className="space-y-6">
                                {filteredCandidates.map((candidate, index) => (
                                    <div
                                        key={candidate.id}
                                        className={`border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-2xl ${index === 0 ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-amber-50' :
                                            index === 1 ? 'border-blue-300 bg-gradient-to-r from-blue-50 to-sky-50' :
                                                index === 2 ? 'border-green-300 bg-gradient-to-r from-green-50 to-emerald-50' :
                                                    'border-slate-200 bg-white'
                                            }`}
                                    >
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between mb-6">
                                            <div className="flex items-start mb-4 lg:mb-0">
                                                <div className={`relative flex-shrink-0 ${index === 0 ? 'w-16 h-16' : 'w-14 h-14'
                                                    }`}>
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

                                                <div className="ml-6">
                                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                                        <h3 className="text-2xl font-bold text-slate-800">{candidate.name}</h3>
                                                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor(candidate.status)}`}>
                                                            {candidate.status}
                                                        </span>
                                                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(candidate.recommendation)}`}>
                                                            {candidate.recommendation}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                                                        <span className="flex items-center">
                                                            <Briefcase className="w-4 h-4 mr-2" />
                                                            {candidate.experience} experience
                                                        </span>
                                                        <span className="flex items-center">
                                                            <GraduationCap className="w-4 h-4 mr-2" />
                                                            {candidate.education}
                                                        </span>
                                                        <div className="relative">
                                                            <div className="w-32 h-3 bg-slate-200 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${getHireProbabilityColor(candidate.hireProbability)}`}
                                                                    style={{ width: `${candidate.hireProbability}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-semibold ml-2">{candidate.hireProbability}% Hire Probability</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className={`text-5xl font-bold mb-2 ${getScoreColor(candidate.overallScore)}`}>
                                                    {candidate.overallScore}
                                                </div>
                                                <div className="text-sm text-slate-600">Overall Score</div>
                                            </div>
                                        </div>

                                        {/* Score Breakdown */}
                                        <div className="mb-6">
                                            <h4 className="text-lg font-semibold text-slate-700 mb-4">Stage Performance Breakdown</h4>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                                                    <div className="text-sm text-slate-600 mb-1">Semantic Analysis</div>
                                                    <div className="text-2xl font-bold text-purple-600">{candidate.semantic}</div>
                                                    <div className="text-xs text-slate-500">Match Score</div>
                                                </div>

                                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl">
                                                    <div className="text-sm text-slate-600 mb-1">Technical Test</div>
                                                    <div className="text-2xl font-bold text-orange-600">{candidate.technical}</div>
                                                    <div className="text-xs text-slate-500">Technical Score</div>
                                                </div>

                                                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-xl">
                                                    <div className="text-sm text-slate-600 mb-1">Tech Interview</div>
                                                    <div className="text-2xl font-bold text-red-600">{candidate.techInterview}</div>
                                                    <div className="text-xs text-slate-500">/10 Rating</div>
                                                </div>

                                                <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-4 rounded-xl">
                                                    <div className="text-sm text-slate-600 mb-1">HR Interview</div>
                                                    <div className="text-2xl font-bold text-pink-600">{candidate.hrInterview}</div>
                                                    <div className="text-xs text-slate-500">/10 Rating</div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Skills and Notes */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                            <div>
                                                <h4 className="text-lg font-semibold text-slate-700 mb-3">Key Skills</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {candidate.skills.map((skill, skillIndex) => (
                                                        <span
                                                            key={skillIndex}
                                                            className="px-4 py-2 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-lg font-medium hover:from-slate-200 hover:to-slate-300 transition-all"
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-lg font-semibold text-slate-700 mb-3">Evaluation Notes</h4>
                                                <p className="text-slate-600 bg-slate-50 p-4 rounded-lg">{candidate.notes}</p>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-wrap justify-between items-center pt-6 border-t border-slate-200">
                                            <div className="flex items-center space-x-4">
                                                <button className="text-yellow-600 hover:text-yellow-800 font-semibold flex items-center">
                                                    <Star className="w-5 h-5 mr-2" />
                                                    Add to Favorites
                                                </button>
                                                <button
                                                    onClick={() => setShowCVModal(candidate)}
                                                    className="text-blue-600 hover:text-blue-800 font-semibold flex items-center"
                                                >
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    View CV
                                                </button>
                                                <button
                                                    onClick={() => setShowFullReportModal(candidate)}
                                                    className="text-purple-600 hover:text-purple-800 font-semibold flex items-center"
                                                >
                                                    <FileText className="w-5 h-5 mr-2" />
                                                    Full Report
                                                </button>
                                            </div>

                                            <div className="flex items-center space-x-4 mt-4 md:mt-0">
                                                <button className="border-2 border-slate-300 text-slate-700 hover:bg-slate-50 px-6 py-3 rounded-lg font-semibold transition-colors">
                                                    Schedule Follow-up
                                                </button>
                                                <button
                                                    onClick={() => alert(`Extending offer to ${candidate.name}`)}
                                                    className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all flex items-center"
                                                >
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Extend Offer
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Comparative Analysis */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Comparative Analysis</h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Score Distribution */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Score Distribution</h3>
                                    <div className="space-y-4">
                                        {filteredCandidates.map((candidate) => (
                                            <div key={candidate.id} className="flex items-center">
                                                <div className="w-32 text-sm font-medium text-slate-700">{candidate.name}</div>
                                                <div className="flex-1 ml-4">
                                                    <div className="relative h-8 rounded-lg overflow-hidden">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200"></div>
                                                        <div
                                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-amber-600 transition-all duration-1000"
                                                            style={{ width: `${candidate.overallScore}%` }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-800">
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
                                    <h3 className="text-lg font-semibold text-slate-700 mb-4">Recommendation Summary</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-xl text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">
                                                {filteredCandidates.filter(c => c.recommendation === 'Strongly Recommend').length}
                                            </div>
                                            <div className="text-sm text-slate-600">Strongly Recommend</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                                {filteredCandidates.filter(c => c.recommendation === 'Recommend').length}
                                            </div>
                                            <div className="text-sm text-slate-600">Recommend</div>
                                        </div>
                                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
                                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                                {filteredCandidates.filter(c => c.recommendation === 'Consider').length}
                                            </div>
                                            <div className="text-sm text-slate-600">Consider</div>
                                        </div>
                                    </div>

                                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                                        <div className="flex items-center">
                                            <CheckCircle className="w-6 h-6 text-yellow-600 mr-3" />
                                            <div>
                                                <h4 className="font-bold text-slate-800">Ready for Hiring Decision</h4>
                                                <p className="text-sm text-slate-600">
                                                    All {filteredCandidates.length} candidates have completed all evaluation stages and are ready for final hiring decisions.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Final Actions */}
                        <div className="flex justify-end space-x-4">
                            <button className="px-8 py-4 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors">
                                Save for Later
                            </button>
                            <button
                                onClick={() => alert('Making final selection for top candidates')}
                                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all flex items-center"
                            >
                                <CheckCircle className="w-6 h-6 mr-3" />
                                Make Final Selection
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <Award className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-700 mb-2">Select an Application</h3>
                        <p className="text-slate-500">Choose an application from the list above to view final candidate rankings</p>
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
                                                    <ChevronRight className="w-4 h-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
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
                                    <button className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors">
                                        Download CV
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Full Report Modal */}
                {showFullReportModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-3xl font-bold text-slate-800">Candidate Full Report</h2>
                                    <button
                                        onClick={() => setShowFullReportModal(null)}
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <ChevronRight className="w-6 h-6 text-slate-600 rotate-180" />
                                    </button>
                                </div>

                                {(() => {
                                    const report = generateFullReport(showFullReportModal);
                                    return (
                                        <div className="space-y-8">
                                            {/* Personal Information Header */}
                                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                                                            {report.personalInfo.name.split(' ').map(n => n[0]).join('')}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-2xl font-bold text-slate-800">{report.personalInfo.name}</h3>
                                                            <div className="text-slate-600 mt-1">
                                                                <div className="flex items-center mb-1">
                                                                    <Mail className="w-4 h-4 mr-2" />
                                                                    {report.personalInfo.email}
                                                                </div>
                                                                <div className="flex items-center mb-1">
                                                                    <Phone className="w-4 h-4 mr-2" />
                                                                    {report.personalInfo.phone}
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <MapPin className="w-4 h-4 mr-2" />
                                                                    {report.personalInfo.location}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-4xl font-bold text-blue-600 mb-2">{report.overallPerformance.overallScore}</div>
                                                        <div className="text-sm text-slate-600">Overall Score</div>
                                                        <div className="text-lg font-semibold mt-2">Rank #{report.overallPerformance.rank}/{report.overallPerformance.totalCandidates}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Overall Performance Summary */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                                                    <div className="flex items-center mb-4">
                                                        <Trophy className="w-8 h-8 text-green-600 mr-3" />
                                                        <h4 className="font-bold text-slate-800">Performance Status</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Status:</span>
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.overallPerformance.status)}`}>
                                                                {report.overallPerformance.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Recommendation:</span>
                                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRecommendationColor(report.overallPerformance.recommendation)}`}>
                                                                {report.overallPerformance.recommendation}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Percentile:</span>
                                                            <span className="font-bold text-green-600">Top {report.overallPerformance.percentile}%</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                                    <div className="flex items-center mb-4">
                                                        <Briefcase className="w-8 h-8 text-blue-600 mr-3" />
                                                        <h4 className="font-bold text-slate-800">Experience</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Experience:</span>
                                                            <span className="font-bold">{report.personalInfo.experience}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-slate-600">Education:</span>
                                                            <span className="font-bold">{report.personalInfo.education}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                                                    <div className="flex items-center mb-4">
                                                        <Brain className="w-8 h-8 text-purple-600 mr-3" />
                                                        <h4 className="font-bold text-slate-800">Skills Summary</h4>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div>
                                                            <span className="text-slate-600 text-sm">Technical:</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {report.skillsAssessment.technical.slice(0, 3).map((skill, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-slate-600 text-sm">Soft Skills:</span>
                                                            <div className="flex flex-wrap gap-1 mt-1">
                                                                {report.skillsAssessment.soft.slice(0, 3).map((skill, i) => (
                                                                    <span key={i} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">{skill}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex justify-end space-x-4 pt-6 border-t border-slate-200">
                                                <button
                                                    onClick={() => setShowFullReportModal(null)}
                                                    className="px-6 py-3 border-2 border-slate-300 text-slate-600 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                                                >
                                                    Close Report
                                                </button>
                                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center">
                                                    <Download className="w-5 h-5 mr-2" />
                                                    Download PDF
                                                </button>
                                                <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center">
                                                    <CheckCircle className="w-5 h-5 mr-2" />
                                                    Extend Offer
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}