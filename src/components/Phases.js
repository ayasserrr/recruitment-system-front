import React from 'react';
import { ChevronRight, Briefcase, Plus, Share2, Brain, ClipboardCheck, Video, Users, Award, List, BarChart3, Star } from 'lucide-react';

export default function Phases({ onNavigateToPhase }) {
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-50 via-base-100 to-accent-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-4">
                        <Briefcase className="w-16 h-16 text-base-600" />
                    </div>
                    <h1 className="text-5xl font-bold text-base-900 mb-4">Recruitment Dashboard</h1>
                    <p className="text-xl text-base-600">Manage your hiring process with AI-powered tools</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => onNavigateToPhase(item.id)}
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
}
