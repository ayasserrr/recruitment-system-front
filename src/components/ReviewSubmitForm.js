import React from 'react';
import { CheckCircle, FileText, Globe, ClipboardList, Video, Users, Send, Download, Edit } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function ReviewSubmitForm({ formData, onEditStep, onSubmit, onSaveDraft, onExport }) {
    const { isDarkMode } = useDarkMode();
    const formatArray = (arr) => (arr && arr.length ? arr.join(', ') : 'Not specified');
    const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : 'Not set');
    const formatEducation = (value) => {
        if (Array.isArray(value)) return formatArray(value);
        return value ? String(value) : 'Not specified';
    };

    const formatLocation = () => {
        if (formData.remoteAvailable) return 'Remote';
        const city = String(formData.city || '').trim();
        const country = String(formData.country || '').trim();
        return `${city}${city && country ? ', ' : ''}${country}` || 'Not set';
    };

    const sections = [
        {
            id: 1,
            title: 'Job Details',
            icon: FileText,
            color: 'text-base-900',
            bgColor: 'bg-base-100',
            fields: [
                { label: 'Job Title', value: formData.jobTitle },
                { label: 'Department', value: formData.department },
                { label: 'Seniority Level', value: formData.seniorityLevel },
                { label: 'Employment Type', value: formData.employmentType },
                { label: 'Location', value: formatLocation() },
                { label: 'Remote Available', value: formData.remoteAvailable ? 'Yes' : 'No' },
                { label: 'Required Skills', value: formatArray(formData.requiredSkills) },
                { label: 'Preferred Skills', value: formatArray(formData.preferredSkills) },
                { label: 'Experience', value: `${formData.minExperience || 0} - ${formData.maxExperience || 5} years` },
                { label: 'Education', value: formatEducation(formData.minEducation) },
                { label: 'Salary Range', value: `${formData.minSalary || 0} - ${formData.maxSalary || 0} ${formData.currency || ''}` },
                { label: 'Application Deadline', value: formatDate(formData.deadline) },
            ],
        },
        {
            id: 2,
            title: 'Platforms & Interview',
            icon: Globe,
            color: 'text-base-900',
            bgColor: 'bg-base-100',
            fields: [
                { label: 'Posting Platforms', value: `${formData.selectedPlatforms?.length || 0} platform(s)` },
                { label: 'Posting Period', value: `${formatDate(formData.postingStartDate)} to ${formatDate(formData.postingEndDate)}` },
            ],
        },
        {
            id: 3,
            title: 'Technical Assessment',
            icon: ClipboardList,
            color: 'text-base-900',
            bgColor: 'bg-base-100',
            fields: [
                {
                    label: 'Assessment Type',
                    value:
                        formData.assessmentType === 'ai-generated'
                            ? 'AI-Generated'
                            : formData.assessmentType === 'custom'
                                ? 'Custom'
                                : 'Template',
                },
                { label: 'Questions Count', value: formData.assessmentQuestions?.length || 'AI Generated' },
                { label: 'Time Limit', value: `${formData.assessmentTimeLimit || 60} minutes` },
                { label: 'Candidates to advance', value: formData.assessmentCandidatesToAdvance || 10 },
                ...(formData.assessmentType === 'template'
                    ? [{ label: 'Template Task', value: formData.templateTask }]
                    : []),
                {
                    label: 'Max Attempts',
                    value: formData.maxAttempts === 'unlimited' ? 'Unlimited' : `${formData.maxAttempts || 1} attempt(s)`,
                },
            ],
        },
        {
            id: 4,
            title: 'Technical Interview',
            icon: Video,
            color: 'text-base-900',
            bgColor: 'bg-base-100',
            fields: [
                {
                    label: 'Conducted By',
                    value:
                        formData.technicalInterviewType === 'ai-conducted'
                            ? 'AI'
                            : 'Human + AI Feedback',
                },
                { label: 'Questions', value: formData.technicalInterviewQuestions?.length || 'Not set' },
                { label: 'Duration', value: `${formData.technicalInterviewDuration || 45} minutes` },
                { label: 'Candidates to advance', value: formData.technicalInterviewCandidatesToAdvance || 5 },
            ],
        },
        {
            id: 5,
            title: 'HR Interview',
            icon: Users,
            color: 'text-base-900',
            bgColor: 'bg-base-100',
            fields: [
                {
                    label: 'Conducted By',
                    value:
                        formData.hrInterviewType === 'ai-conducted'
                            ? 'AI'
                            : 'HR Representative',
                },
                { label: 'Questions', value: formData.hrInterviewQuestions?.length || 'Not set' },
                { label: 'Duration', value: `${formData.hrInterviewDuration || 45} minutes` },
                { label: 'Evaluation Criteria', value: `${formData.hrEvaluationCriteria?.length || 0} selected` },
                { label: 'Candidates to advance', value: formData.hrInterviewCandidatesToAdvance || 3 },
            ],
        },
    ];

    const calculateTimeline = () => {
        const startDate = formData.postingStartDate ? new Date(formData.postingStartDate) : null;

        if (!startDate || Number.isNaN(startDate.getTime())) return [];

        const timeline = [];
        let currentDate = new Date(startDate);

        timeline.push({ stage: 'Job Posting Live', date: currentDate.toLocaleDateString() });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 7);
        timeline.push({ stage: 'Application Review', date: currentDate.toLocaleDateString() });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 3);
        timeline.push({ stage: 'Technical Assessment', date: currentDate.toLocaleDateString() });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 3);
        timeline.push({ stage: 'Technical Interview', date: currentDate.toLocaleDateString() });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 3);
        timeline.push({ stage: 'HR Interview', date: currentDate.toLocaleDateString() });

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 2);
        timeline.push({ stage: 'Final Decision', date: currentDate.toLocaleDateString() });

        return timeline;
    };

    const timeline = calculateTimeline();

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="bg-gradient-to-r from-base-500 to-accent-500 rounded-2xl p-8 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Review & Submit Job Requisition</h2>
                        <p className="text-white">Review all details before creating the job posting</p>
                    </div>
                    <CheckCircle className="w-12 h-12" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg mr-4 flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Job Title</p>
                            <p className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{formData.jobTitle || 'Not set'}</p>
                        </div>
                    </div>
                </div>

                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg mr-4 flex-shrink-0">
                            <Globe className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Platforms</p>
                            <p className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{formData.selectedPlatforms?.length || 0} platforms</p>
                        </div>
                    </div>
                </div>

                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg mr-4 flex-shrink-0">
                            <ClipboardList className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Assessment</p>
                            <p className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>
                                {formData.assessmentType === 'ai-generated'
                                    ? 'AI-Generated'
                                    : formData.assessmentType === 'custom'
                                        ? 'Custom'
                                        : 'Template'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg mr-4 flex-shrink-0">
                            <Video className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-base-600'}`}>Interview Type</p>
                            <p className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{formData.technicalInterviewType === 'ai-conducted' ? 'AI' : 'Human'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Review Sections */}
            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg mr-4 flex-shrink-0">
                                    <section.icon className="w-4 h-4 text-white" />
                                </div>
                                <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-base-900'}`}>{section.title}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => onEditStep(section.id)}
                                className={`flex items-center font-medium transition-colors duration-300 ${isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-base-600 hover:text-base-700'}`}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {section.fields.map((field, index) => (
                                <div key={index} className={`p-4 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                                    <p className={`text-sm mb-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{field.label}</p>
                                    <p className={`font-medium transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{field.value || 'Not set'}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Timeline Preview */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <ClipboardList className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Recruitment Timeline</h3>
                </div>

                {timeline.length === 0 ? (
                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Set a Posting Start Date to preview timeline.</p>
                ) : (
                    <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-base-500 to-accent-500"></div>

                        <div className="space-y-8 relative">
                            {timeline.map((item, index) => (
                                <div key={index} className="flex items-start">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 z-10 ${index === 0 ? 'bg-gradient-to-r from-base-600 to-accent-600' : 'bg-gradient-to-r from-base-200 to-accent-200'
                                            }`}
                                    >
                                        {index === 0 ? (
                                            <CheckCircle className="w-4 h-4 text-white" />
                                        ) : (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pt-1">
                                        <h4 className={`font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.stage}</h4>
                                        <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <button
                        type="button"
                        onClick={onExport}
                        className={`flex-1 flex items-center justify-center font-semibold py-4 px-6 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-800 border-2 border-slate-600 text-gray-300 hover:bg-slate-700' : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                    >
                        <Download className="w-5 h-5 mr-3" />
                        Export as PDF
                    </button>

                    <button
                        type="button"
                        onClick={onSaveDraft}
                        className={`flex-1 flex items-center justify-center font-semibold py-4 px-6 rounded-lg transition-colors ${isDarkMode ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-gray-600 text-white hover:bg-gray-700'}`}
                    >
                        Save as Draft
                    </button>

                    <button
                        type="button"
                        onClick={onSubmit}
                        className="flex-1 flex items-center justify-center bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                    >
                        <Send className="w-5 h-5 mr-3" />
                        Submit Job Requisition
                    </button>
                </div>

                <p className={`text-center text-sm mt-4 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    This screen captures requisition requirements only. Candidate results and rankings will be handled later.
                </p>
            </div>
        </div>
    );
}
