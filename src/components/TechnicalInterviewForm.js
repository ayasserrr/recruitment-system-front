import React, { useState } from 'react';
import {
    Video,
    Brain,
    Plus,
    Trash2,
    MessageSquare,
    Code,
    Building2,
    MessageCircle,
    Zap,
    CheckSquare,
    Cpu,
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function TechnicalInterviewForm({ formData, updateFormData }) {
    const { isDarkMode } = useDarkMode();
    const [customQuestions, setCustomQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        category: 'technical',
        difficulty: 'medium',
    });

    const iconComponents = {
        'coding': Code,
        'systemDesign': Building2,
        'debugging': Cpu,
        'communication': MessageCircle,
        'problemSolving': Brain,
        'bestPractices': CheckSquare,
    };

    const interviewOptions = [
        {
            id: 'ai-conducted',
            title: 'AI-Conducted Interview',
            description: 'AI runs the interview and scores answers automatically',
            icon: 'problemSolving',
            features: ['Consistent scoring', 'Automated feedback', 'Fast scheduling'],
        },
        {
            id: 'human-conducted',
            title: 'Human Interview + AI Notes',
            description: 'Interviewer conducts; AI provides structured feedback & scoring',
            icon: 'coding',
            features: ['Human context', 'AI-assisted scoring', 'Interview notes summary'],
        },
    ];

    const criteriaOptions = [
        { id: 'coding', label: 'Coding', icon: 'coding' },
        { id: 'systemDesign', label: 'System Design', icon: 'systemDesign' },
        { id: 'debugging', label: 'Debugging', icon: 'debugging' },
        { id: 'communication', label: 'Communication', icon: 'communication' },
        { id: 'problemSolving', label: 'Problem Solving', icon: 'problemSolving' },
        { id: 'bestPractices', label: 'Best Practices', icon: 'bestPractices' },
    ];

    const questionCategories = [
        { id: 'technical', name: 'Technical', icon: 'coding' },
        { id: 'system-design', name: 'System Design', icon: 'systemDesign' },
        { id: 'behavioral', name: 'Behavioral', icon: 'communication' },
    ];

    const addCustomQuestion = () => {
        if (!newQuestion.text.trim()) return;

        const q = {
            id: Date.now(),
            text: newQuestion.text,
            category: newQuestion.category,
            difficulty: newQuestion.difficulty,
        };

        const updated = [...customQuestions, q];
        setCustomQuestions(updated);
        updateFormData({ technicalInterviewQuestions: updated });
        setNewQuestion({ text: '', category: 'technical', difficulty: 'medium' });
    };

    const removeQuestion = (id) => {
        const updated = customQuestions.filter((q) => q.id !== id);
        setCustomQuestions(updated);
        updateFormData({ technicalInterviewQuestions: updated });
    };

    const toggleCriteria = (id, checked) => {
        const current = formData.aiEvaluationCriteria || [];
        const updated = checked ? [...current, id] : current.filter((x) => x !== id);
        updateFormData({ aiEvaluationCriteria: updated });
    };

    const handleInterviewTypeSelect = (typeId) => {
        updateFormData({ technicalInterviewType: typeId });
    };

    return (
        <div className="space-y-8">
            {/* Interview Type Selection */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Video className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Technical Interview Setup</h3>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose how the technical interview will be conducted</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {interviewOptions.map((option) => {
                        const isSelected = formData.technicalInterviewType === option.id;

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleInterviewTypeSelect(option.id)}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isSelected ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50' : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-gray-200 hover:border-accent-300'
                                    }`}
                            >
                                <div className="flex items-start mb-4">
                                    <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-12 h-12 rounded-lg mr-4 flex-shrink-0">
                                        {React.createElement(iconComponents[option.icon], {
                                            className: 'w-5 h-5 text-white',
                                        })}
                                    </div>
                                    <div>
                                        <h4 className={`font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{option.title}</h4>
                                        <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{option.description}</p>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {option.features.map((feature, index) => (
                                        <li key={index} className={`flex items-center text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <div className="w-1.5 h-1.5 bg-gradient-to-r from-base-500 to-accent-500 rounded-full mr-2"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isSelected && (
                                    <div className="mt-4 p-3 bg-gradient-to-r from-base-100 to-accent-100 rounded-lg border border-accent-300">
                                        <p className="text-sm font-medium bg-gradient-to-r from-base-700 to-accent-700 bg-clip-text text-transparent">✓ Selected</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Evaluation Criteria */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Evaluation Criteria</h3>
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Select evaluation criteria for technical interview:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {criteriaOptions.map((criteria) => (
                            <label
                                key={criteria.id}
                                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-300 ${isDarkMode ? 'border-slate-600 hover:bg-slate-700' : 'border-gray-200 hover:bg-gray-50'}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.aiEvaluationCriteria?.includes(criteria.id) || false}
                                    onChange={(e) => toggleCriteria(criteria.id, e.target.checked)}
                                    className="w-4 h-4 text-accent-600 rounded focus:ring-accent-500"
                                />
                                <span className={`ml-3 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{criteria.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Interview Duration (Minutes) *</label>
                        <select
                            value={formData.technicalInterviewDuration || '45'}
                            onChange={(e) => updateFormData({ technicalInterviewDuration: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI Feedback Level</label>
                        <select
                            value={formData.aiFeedbackLevel || 'detailed'}
                            onChange={(e) => updateFormData({ aiFeedbackLevel: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            <option value="summary">Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="very-detailed">Very Detailed</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Scoring System</label>
                        <select
                            value={formData.scoringSystem || '1-5'}
                            onChange={(e) => updateFormData({ scoringSystem: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            <option value="1-5">1-5 Scale</option>
                            <option value="1-10">1-10 Scale</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Candidates to advance after this phase</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.technicalInterviewCandidatesToAdvance || 5}
                            onChange={(e) => updateFormData({ technicalInterviewCandidatesToAdvance: parseInt(e.target.value) })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Notes for Interviewers</label>
                    <textarea
                        value={formData.interviewerNotes || ''}
                        onChange={(e) => updateFormData({ interviewerNotes: e.target.value })}
                        placeholder="Specific instructions, focus areas, red flags..."
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                    />
                </div>
            </div>

            {/* Question Setup */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Technical Interview Questions</h3>
                            <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                Add questions now (we will generate additional questions later if needed)
                            </p>
                        </div>
                    </div>
                    <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Questions: <span className="font-bold text-accent-600">{customQuestions.length}</span>
                    </div>
                </div>

                {/* Add Question Form */}
                <div className={`rounded-lg p-6 mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                    <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add Interview Question</h4>

                    <div className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Question Text *</label>
                            <textarea
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                placeholder="Enter technical interview question..."
                                rows="3"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Category</label>
                                <select
                                    value={newQuestion.category}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                >
                                    {questionCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty</label>
                                <select
                                    value={newQuestion.difficulty}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                >
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addCustomQuestion}
                            disabled={!newQuestion.text.trim()}
                            className="flex items-center justify-center w-full bg-gradient-to-r from-base-600 to-accent-600 hover:from-base-700 hover:to-accent-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question
                        </button>
                    </div>
                </div>

                {/* Custom Questions List */}
                {customQuestions.length > 0 && (
                    <div>
                        <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Your Questions</h4>
                        <div className="space-y-3">
                            {customQuestions.map((question) => (
                                <div key={question.id} className={`border rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className={`mb-2 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{question.text}</p>
                                            <div className={`flex items-center text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <span className={`px-2 py-1 rounded mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>{question.category}</span>
                                                <span className={`px-2 py-1 rounded mr-3 transition-colors duration-300 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-100'}`}>{question.difficulty}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="ml-4 text-accent-600 hover:text-accent-700"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
