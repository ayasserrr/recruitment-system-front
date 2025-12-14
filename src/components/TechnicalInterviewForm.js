import React, { useState } from 'react';
import {
    Video,
    Brain,
    Plus,
    Trash2,
    MessageSquare,
} from 'lucide-react';

export default function TechnicalInterviewForm({ formData, updateFormData }) {
    const [customQuestions, setCustomQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        category: 'technical',
        difficulty: 'medium',
    });

    const interviewOptions = [
        {
            id: 'ai-conducted',
            title: 'AI-Conducted Interview',
            description: 'AI runs the interview and scores answers automatically',
            icon: '🤖',
            features: ['Consistent scoring', 'Automated feedback', 'Fast scheduling'],
        },
        {
            id: 'human-conducted',
            title: 'Human Interview + AI Notes',
            description: 'Interviewer conducts; AI provides structured feedback & scoring',
            icon: '🧑‍💻',
            features: ['Human context', 'AI-assisted scoring', 'Interview notes summary'],
        },
    ];

    const criteriaOptions = [
        { id: 'coding', label: 'Coding', icon: '💻' },
        { id: 'systemDesign', label: 'System Design', icon: '🏗️' },
        { id: 'debugging', label: 'Debugging', icon: '🐞' },
        { id: 'communication', label: 'Communication', icon: '💬' },
        { id: 'problemSolving', label: 'Problem Solving', icon: '🧠' },
        { id: 'bestPractices', label: 'Best Practices', icon: '✅' },
    ];

    const questionCategories = [
        { id: 'technical', name: 'Technical', icon: '💻' },
        { id: 'system-design', name: 'System Design', icon: '🏗️' },
        { id: 'behavioral', name: 'Behavioral', icon: '💬' },
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
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                        <Video className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Technical Interview Setup</h3>
                        <p className="text-sm text-gray-600 mt-1">Choose how the technical interview will be conducted</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {interviewOptions.map((option) => {
                        const isSelected = formData.technicalInterviewType === option.id;

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleInterviewTypeSelect(option.id)}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isSelected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="flex items-start mb-4">
                                    <span className="text-3xl mr-3">{option.icon}</span>
                                    <div>
                                        <h4 className="font-bold text-gray-800">{option.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                                    </div>
                                </div>

                                <ul className="space-y-2">
                                    {option.features.map((feature, index) => (
                                        <li key={index} className="flex items-center text-sm text-gray-600">
                                            <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isSelected && (
                                    <div className="mt-4 p-3 bg-red-100 rounded-lg">
                                        <p className="text-sm text-red-800 font-medium">✅ Selected</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <Brain className="w-6 h-6 text-red-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">Evaluation Criteria</h3>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select evaluation criteria for technical interview:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {criteriaOptions.map((criteria) => (
                            <label
                                key={criteria.id}
                                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.aiEvaluationCriteria?.includes(criteria.id) || false}
                                    onChange={(e) => toggleCriteria(criteria.id, e.target.checked)}
                                    className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                                />
                                <span className="ml-3 text-xl mr-3">{criteria.icon}</span>
                                <span className="text-gray-700">{criteria.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interview Duration (Minutes) *</label>
                        <select
                            value={formData.technicalInterviewDuration || '45'}
                            onChange={(e) => updateFormData({ technicalInterviewDuration: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                            <option value="90">90 minutes</option>
                            <option value="120">120 minutes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">AI Feedback Level</label>
                        <select
                            value={formData.aiFeedbackLevel || 'detailed'}
                            onChange={(e) => updateFormData({ aiFeedbackLevel: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="summary">Summary</option>
                            <option value="detailed">Detailed</option>
                            <option value="very-detailed">Very Detailed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Number of Interviewers</label>
                        <select
                            value={formData.numberOfInterviewers || '1'}
                            onChange={(e) => updateFormData({ numberOfInterviewers: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="panel">Panel</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Scoring System</label>
                        <select
                            value={formData.scoringSystem || '1-5'}
                            onChange={(e) => updateFormData({ scoringSystem: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="1-5">1-5 Scale</option>
                            <option value="1-10">1-10 Scale</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Candidates to advance after this phase</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.technicalInterviewCandidatesToAdvance || 5}
                            onChange={(e) => updateFormData({ technicalInterviewCandidatesToAdvance: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes for Interviewers</label>
                    <textarea
                        value={formData.interviewerNotes || ''}
                        onChange={(e) => updateFormData({ interviewerNotes: e.target.value })}
                        placeholder="Specific instructions, focus areas, red flags..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>
            </div>

            {/* Question Setup */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 text-red-600 mr-3" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">Technical Interview Questions</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Add questions now (we will generate additional questions later if needed)
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        Questions: <span className="font-bold text-red-600">{customQuestions.length}</span>
                    </div>
                </div>

                {/* Add Question Form */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-gray-800 mb-4">Add Interview Question</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                            <textarea
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                placeholder="Enter technical interview question..."
                                rows="3"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={newQuestion.category}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, category: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    {questionCategories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                                <select
                                    value={newQuestion.difficulty}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
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
                            className="flex items-center justify-center w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question
                        </button>
                    </div>
                </div>

                {/* Custom Questions List */}
                {customQuestions.length > 0 && (
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Your Questions</h4>
                        <div className="space-y-3">
                            {customQuestions.map((question) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <p className="text-gray-800 mb-2">{question.text}</p>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="px-2 py-1 bg-gray-100 rounded mr-3">{question.category}</span>
                                                <span className="px-2 py-1 bg-gray-100 rounded mr-3">{question.difficulty}</span>
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeQuestion(question.id)}
                                            className="ml-4 text-red-600 hover:text-red-700"
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
