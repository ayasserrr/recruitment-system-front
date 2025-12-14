import React, { useState } from 'react';
import { Briefcase, FileText, Share2, Brain, ClipboardCheck, Video, Users, Award, List, ChevronRight, CheckCircle, Clock, Send, Eye } from 'lucide-react';

export default function RecruitmentSystem() {
    const [currentPage, setCurrentPage] = useState('home');
    const [jobDescription, setJobDescription] = useState({
        title: '',
        requirements: '',
        responsibilities: '',
        qualifications: '',
        experience: '',
        location: ''
    });

    const [jobPost, setJobPost] = useState({
        selectedJob: '',
        platforms: [],
        scheduleDate: '',
        scheduleTime: ''
    });

    const [postStatus] = useState([
        { step: 'Job Post Created', status: 'completed', icon: CheckCircle },
        { step: 'Bias Detection', status: 'completed', icon: CheckCircle, note: 'No bias detected' },
        { step: 'Posted to Platforms', status: 'completed', icon: CheckCircle },
        { step: 'Receiving CVs', status: 'active', icon: Clock, count: 45 },
        { step: 'Closed', status: 'pending', icon: Clock }
    ]);

    const [semanticCandidates] = useState([
        { name: 'Sarah Johnson', score: 92, skills: ['Python', 'ML', 'Data Analysis'], match: 'Excellent' },
        { name: 'Michael Chen', score: 88, skills: ['Java', 'Spring', 'Microservices'], match: 'Very Good' },
        { name: 'Emma Williams', score: 85, skills: ['React', 'Node.js', 'AWS'], match: 'Very Good' },
        { name: 'James Brown', score: 78, skills: ['C++', 'Algorithms', 'DSA'], match: 'Good' }
    ]);

    const [technicalAssessments] = useState([
        {
            jobTitle: 'Senior Software Engineer',
            totalCandidates: 45,
            sent: 30,
            completed: 22,
            pending: 8,
            deadline: '2025-12-05',
            status: 'active'
        },
        {
            jobTitle: 'Data Scientist',
            totalCandidates: 32,
            sent: 25,
            completed: 25,
            pending: 0,
            deadline: '2025-11-20',
            status: 'completed'
        }
    ]);

    const [assessmentRanking] = useState([
        { name: 'Sarah Johnson', score: 95, technical: 'Excellent', problemSolving: 'Outstanding', timeSpent: '45 min' },
        { name: 'Michael Chen', score: 89, technical: 'Very Good', problemSolving: 'Good', timeSpent: '52 min' },
        { name: 'Emma Williams', score: 87, technical: 'Very Good', problemSolving: 'Very Good', timeSpent: '48 min' },
        { name: 'James Brown', score: 82, technical: 'Good', problemSolving: 'Good', timeSpent: '55 min' }
    ]);

    const [technicalInterviews] = useState([
        {
            jobTitle: 'Senior Software Engineer',
            scheduled: 15,
            completed: 10,
            pending: 5,
            avgScore: 8.2
        }
    ]);

    const [hrInterviews] = useState([
        {
            jobTitle: 'Senior Software Engineer',
            scheduled: 10,
            completed: 7,
            pending: 3,
            avgScore: 8.5
        }
    ]);

    const [finalRanking] = useState([
        {
            name: 'Sarah Johnson',
            overallScore: 94,
            semantic: 92,
            technical: 95,
            techInterview: 9.0,
            hrInterview: 9.2,
            recommendation: 'Strongly Recommend'
        },
        {
            name: 'Michael Chen',
            overallScore: 88,
            semantic: 88,
            technical: 89,
            techInterview: 8.5,
            hrInterview: 8.8,
            recommendation: 'Recommend'
        },
        {
            name: 'Emma Williams',
            overallScore: 86,
            semantic: 85,
            technical: 87,
            techInterview: 8.2,
            hrInterview: 8.9,
            recommendation: 'Recommend'
        }
    ]);

    const [applications] = useState([
        {
            id: 1,
            jobTitle: 'Senior Software Engineer',
            posted: '2025-10-15',
            cvs: 45,
            semantic: 30,
            assessment: 22,
            techInterview: 10,
            hrInterview: 7,
            finalCandidates: 3,
            status: 'In Progress'
        },
        {
            id: 2,
            jobTitle: 'Data Scientist',
            posted: '2025-10-01',
            cvs: 32,
            semantic: 25,
            assessment: 25,
            techInterview: 8,
            hrInterview: 5,
            finalCandidates: 2,
            status: 'Final Stage'
        }
    ]);

    const menuItems = [
        { id: 'job-description', icon: FileText, label: 'Job Description', color: 'bg-blue-500' },
        { id: 'job-post', icon: Share2, label: 'Job Post', color: 'bg-green-500' },
        { id: 'semantic-analysis', icon: Brain, label: 'Semantic Analysis', color: 'bg-purple-500' },
        { id: 'technical-assessment', icon: ClipboardCheck, label: 'Technical Assessment', color: 'bg-orange-500' },
        { id: 'technical-interview', icon: Video, label: 'Technical Interview', color: 'bg-red-500' },
        { id: 'hr-interview', icon: Users, label: 'HR Interview', color: 'bg-pink-500' },
        { id: 'final-ranking', icon: Award, label: 'Final Ranking', color: 'bg-yellow-500' },
        { id: 'applications', icon: List, label: 'Applications', color: 'bg-indigo-500' }
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
                            onClick={() => setCurrentPage(item.id)}
                            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-left border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-2"
                        >
                            <div className={`${item.color} w-16 h-16 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <item.icon className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{item.label}</h3>
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

    const renderJobDescription = () => (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-blue-600 hover:text-blue-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <FileText className="w-10 h-10 text-blue-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Create Job Description</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Job Title</label>
                            <input
                                type="text"
                                value={jobDescription.title}
                                onChange={(e) => setJobDescription({ ...jobDescription, title: e.target.value })}
                                placeholder="e.g., Senior Software Engineer"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Requirements</label>
                            <textarea
                                value={jobDescription.requirements}
                                onChange={(e) => setJobDescription({ ...jobDescription, requirements: e.target.value })}
                                placeholder="List the key requirements..."
                                rows="4"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Responsibilities</label>
                            <textarea
                                value={jobDescription.responsibilities}
                                onChange={(e) => setJobDescription({ ...jobDescription, responsibilities: e.target.value })}
                                placeholder="Describe the key responsibilities..."
                                rows="4"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Qualifications</label>
                            <textarea
                                value={jobDescription.qualifications}
                                onChange={(e) => setJobDescription({ ...jobDescription, qualifications: e.target.value })}
                                placeholder="Required qualifications and education..."
                                rows="3"
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Experience Level</label>
                                <input
                                    type="text"
                                    value={jobDescription.experience}
                                    onChange={(e) => setJobDescription({ ...jobDescription, experience: e.target.value })}
                                    placeholder="e.g., 5+ years"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                <input
                                    type="text"
                                    value={jobDescription.location}
                                    onChange={(e) => setJobDescription({ ...jobDescription, location: e.target.value })}
                                    placeholder="e.g., Remote, New York"
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 mr-2" />
                            Save Job Description
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderJobPost = () => (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-green-600 hover:text-green-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <div className="flex items-center mb-6">
                        <Share2 className="w-10 h-10 text-green-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Post Job</h2>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Job</label>
                            <select
                                value={jobPost.selectedJob}
                                onChange={(e) => setJobPost({ ...jobPost, selectedJob: e.target.value })}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                            >
                                <option value="">Choose a job description...</option>
                                <option value="senior-engineer">Senior Software Engineer</option>
                                <option value="data-scientist">Data Scientist</option>
                                <option value="product-manager">Product Manager</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-3">Posting Platforms</label>
                            <div className="space-y-3">
                                {['LinkedIn', 'Indeed', 'Glassdoor', 'Monster'].map((platform) => (
                                    <label key={platform} className="flex items-center p-4 border-2 border-slate-200 rounded-lg hover:border-green-500 cursor-pointer transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={jobPost.platforms.includes(platform)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setJobPost({ ...jobPost, platforms: [...jobPost.platforms, platform] });
                                                } else {
                                                    setJobPost({ ...jobPost, platforms: jobPost.platforms.filter(p => p !== platform) });
                                                }
                                            }}
                                            className="w-5 h-5 text-green-600"
                                        />
                                        <span className="ml-3 text-slate-700 font-medium">{platform}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Schedule Date</label>
                                <input
                                    type="date"
                                    value={jobPost.scheduleDate}
                                    onChange={(e) => setJobPost({ ...jobPost, scheduleDate: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Schedule Time</label>
                                <input
                                    type="time"
                                    value={jobPost.scheduleTime}
                                    onChange={(e) => setJobPost({ ...jobPost, scheduleTime: e.target.value })}
                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-green-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center">
                            <Send className="w-5 h-5 mr-2" />
                            Post Job
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-6">Posting Progress</h3>
                    <div className="space-y-4">
                        {postStatus.map((item, index) => (
                            <div key={index} className="flex items-center p-4 bg-slate-50 rounded-lg">
                                <item.icon className={`w-8 h-8 mr-4 ${item.status === 'completed' ? 'text-green-600' :
                                    item.status === 'active' ? 'text-blue-600' : 'text-slate-400'
                                    }`} />
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800">{item.step}</h4>
                                    {item.note && <p className="text-sm text-slate-600">{item.note}</p>}
                                    {item.count && <p className="text-sm text-blue-600 font-semibold">{item.count} CVs received</p>}
                                </div>
                                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    item.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                                    }`}>
                                    {item.status === 'completed' ? 'Completed' : item.status === 'active' ? 'Active' : 'Pending'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderSemanticAnalysis = () => (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-purple-600 hover:text-purple-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <Brain className="w-10 h-10 text-purple-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Semantic Analysis Reports</h2>
                    </div>

                    <div className="mb-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
                        <div className="flex items-center">
                            <CheckCircle className="w-6 h-6 text-purple-600 mr-3" />
                            <div>
                                <h3 className="font-bold text-slate-800">Analysis Complete</h3>
                                <p className="text-sm text-slate-600">Processed 45 candidates for Senior Software Engineer position</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {semanticCandidates.map((candidate, index) => (
                            <div key={index} className="border-2 border-slate-200 rounded-lg p-6 hover:border-purple-500 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{candidate.name}</h3>
                                        <div className="flex items-center mt-2">
                                            <span className="text-3xl font-bold text-purple-600 mr-3">{candidate.score}</span>
                                            <div>
                                                <p className="text-sm text-slate-600">Semantic Match Score</p>
                                                <p className="text-sm font-semibold text-purple-600">{candidate.match} Match</p>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center">
                                        <Eye className="w-4 h-4 mr-2" />
                                        View Full Report
                                    </button>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-700 mb-2">Matched Skills:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {candidate.skills.map((skill, i) => (
                                            <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderTechnicalAssessment = () => (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-orange-600 hover:text-orange-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="space-y-6">
                    {technicalAssessments.map((assessment, index) => (
                        <div key={index} className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <ClipboardCheck className="w-10 h-10 text-orange-600 mr-4" />
                                    <div>
                                        <h2 className="text-2xl font-bold text-slate-800">{assessment.jobTitle}</h2>
                                        <p className="text-slate-600">Technical Assessment</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-2 rounded-full font-semibold ${assessment.status === 'active' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                    }`}>
                                    {assessment.status === 'active' ? 'In Progress' : 'Completed'}
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Total Candidates</p>
                                    <p className="text-3xl font-bold text-slate-800">{assessment.totalCandidates}</p>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Assessments Sent</p>
                                    <p className="text-3xl font-bold text-blue-600">{assessment.sent}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Completed</p>
                                    <p className="text-3xl font-bold text-green-600">{assessment.completed}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Pending</p>
                                    <p className="text-3xl font-bold text-orange-600">{assessment.pending}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-sm text-slate-600 mb-2">Deadline: <span className="font-semibold text-slate-800">{assessment.deadline}</span></p>
                                <div className="w-full bg-slate-200 rounded-full h-3">
                                    <div
                                        className="bg-orange-600 h-3 rounded-full transition-all"
                                        style={{ width: `${(assessment.completed / assessment.sent) * 100}%` }}
                                    />
                                </div>
                            </div>

                            {assessment.status === 'completed' && (
                                <div className="border-t-2 border-slate-200 pt-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">Candidate Rankings</h3>
                                    <div className="space-y-3">
                                        {assessmentRanking.map((candidate, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                                                        {i + 1}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800">{candidate.name}</h4>
                                                        <p className="text-sm text-slate-600">{candidate.technical} • {candidate.problemSolving} Problem Solving • {candidate.timeSpent}</p>
                                                    </div>
                                                </div>
                                                <div className="text-2xl font-bold text-orange-600">{candidate.score}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderTechnicalInterview = () => (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-red-600 hover:text-red-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <Video className="w-10 h-10 text-red-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Technical Interview Management</h2>
                    </div>

                    {technicalInterviews.map((interview, index) => (
                        <div key={index} className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{interview.jobTitle}</h3>
                                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                                    Avg Score: {interview.avgScore}/10
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Scheduled</p>
                                    <p className="text-4xl font-bold text-blue-600">{interview.scheduled}</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Completed</p>
                                    <p className="text-4xl font-bold text-green-600">{interview.completed}</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Pending</p>
                                    <p className="text-4xl font-bold text-orange-600">{interview.pending}</p>
                                </div>
                            </div>

                            <div className="border-t-2 border-slate-200 pt-6">
                                <h4 className="text-xl font-bold text-slate-800 mb-4">Interview Results</h4>
                                <div className="space-y-3">
                                    {assessmentRanking.slice(0, 3).map((candidate, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <h5 className="font-bold text-slate-800">{candidate.name}</h5>
                                                <p className="text-sm text-slate-600">Technical Skills: {candidate.technical} • Problem Solving: {candidate.problemSolving}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-red-600">{(8 + Math.random() * 2).toFixed(1)}</p>
                                                <p className="text-sm text-slate-600">Score</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderHRInterview = () => (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-pink-600 hover:text-pink-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <Users className="w-10 h-10 text-pink-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">HR Interview Management</h2>
                    </div>

                    {hrInterviews.map((interview, index) => (
                        <div key={index} className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl font-bold text-slate-800">{interview.jobTitle}</h3>
                                <div className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold">
                                    Avg Score: {interview.avgScore}/10
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-blue-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Scheduled</p>
                                    <p className="text-4xl font-bold text-blue-600">{interview.scheduled}</p>
                                </div>
                                <div className="bg-green-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Completed</p>
                                    <p className="text-4xl font-bold text-green-600">{interview.completed}</p>
                                </div>
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <p className="text-sm text-slate-600 mb-1">Pending</p>
                                    <p className="text-4xl font-bold text-orange-600">{interview.pending}</p>
                                </div>
                            </div>

                            <div className="border-t-2 border-slate-200 pt-6">
                                <h4 className="text-xl font-bold text-slate-800 mb-4">Interview Results</h4>
                                <div className="space-y-3">
                                    {finalRanking.slice(0, 3).map((candidate, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                            <div>
                                                <h5 className="font-bold text-slate-800">{candidate.name}</h5>
                                                <p className="text-sm text-slate-600">Culture Fit • Communication • Leadership Potential</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-pink-600">{candidate.hrInterview}</p>
                                                <p className="text-sm text-slate-600">Score</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderFinalRanking = () => (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-slate-100 p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-yellow-600 hover:text-yellow-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <Award className="w-10 h-10 text-yellow-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Final Candidate Rankings</h2>
                    </div>

                    <div className="mb-6 p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                        <p className="text-slate-700"><span className="font-bold">{finalRanking.length}</span> candidates have successfully completed all stages of the recruitment process.</p>
                    </div>

                    <div className="space-y-6">
                        {finalRanking.map((candidate, index) => (
                            <div key={index} className="border-2 border-slate-200 rounded-lg p-6 hover:border-yellow-500 transition-colors">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold text-xl mr-4">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-slate-800">{candidate.name}</h3>
                                            <p className="text-lg font-semibold text-yellow-600">{candidate.recommendation}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-slate-600">Overall Score</p>
                                        <p className="text-4xl font-bold text-yellow-600">{candidate.overallScore}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-4">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">Semantic</p>
                                        <p className="text-2xl font-bold text-purple-600">{candidate.semantic}</p>
                                    </div>
                                    <div className="bg-orange-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">Technical Test</p>
                                        <p className="text-2xl font-bold text-orange-600">{candidate.technical}</p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">Tech Interview</p>
                                        <p className="text-2xl font-bold text-red-600">{candidate.techInterview}</p>
                                    </div>
                                    <div className="bg-pink-50 p-4 rounded-lg">
                                        <p className="text-sm text-slate-600 mb-1">HR Interview</p>
                                        <p className="text-2xl font-bold text-pink-600">{candidate.hrInterview}</p>
                                    </div>
                                </div>

                                <button className="mt-4 w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center">
                                    <Eye className="w-5 h-5 mr-2" />
                                    View Complete Report
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderApplications = () => (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-slate-100 p-8">
            <div className="max-w-7xl mx-auto">
                <button onClick={() => setCurrentPage('home')} className="mb-6 text-indigo-600 hover:text-indigo-800 font-semibold flex items-center">
                    <ChevronRight className="w-5 h-5 rotate-180 mr-2" /> Back to Home
                </button>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="flex items-center mb-6">
                        <List className="w-10 h-10 text-indigo-600 mr-4" />
                        <h2 className="text-3xl font-bold text-slate-800">Application Management</h2>
                    </div>

                    <div className="space-y-6">
                        {applications.map((app) => (
                            <div key={app.id} className="border-2 border-slate-200 rounded-lg p-6 hover:border-indigo-500 transition-colors">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-slate-800">{app.jobTitle}</h3>
                                        <p className="text-slate-600">Posted on {app.posted}</p>
                                    </div>
                                    <div className={`px-4 py-2 rounded-full font-semibold ${app.status === 'Final Stage' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {app.status}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">CVs Received</span>
                                        <span className="text-2xl font-bold text-slate-800">{app.cvs}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Semantic Analysis</span>
                                        <span className="text-2xl font-bold text-purple-600">{app.semantic}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Technical Assessment</span>
                                        <span className="text-2xl font-bold text-orange-600">{app.assessment}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Technical Interview</span>
                                        <span className="text-2xl font-bold text-red-600">{app.techInterview}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">HR Interview</span>
                                        <span className="text-2xl font-bold text-pink-600">{app.hrInterview}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                                        <span className="font-semibold text-slate-700">Final Candidates</span>
                                        <span className="text-2xl font-bold text-yellow-600">{app.finalCandidates}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-slate-600">Progress</span>
                                        <span className="text-sm font-semibold text-slate-600">{Math.round((app.finalCandidates / app.cvs) * 100)}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-3">
                                        <div
                                            className="bg-indigo-600 h-3 rounded-full transition-all"
                                            style={{ width: `${(app.finalCandidates / app.cvs) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {currentPage === 'home' && renderHome()}
            {currentPage === 'job-description' && renderJobDescription()}
            {currentPage === 'job-post' && renderJobPost()}
            {currentPage === 'semantic-analysis' && renderSemanticAnalysis()}
            {currentPage === 'technical-assessment' && renderTechnicalAssessment()}
            {currentPage === 'technical-interview' && renderTechnicalInterview()}
            {currentPage === 'hr-interview' && renderHRInterview()}
            {currentPage === 'final-ranking' && renderFinalRanking()}
            {currentPage === 'applications' && renderApplications()}
        </div>
    );
}
