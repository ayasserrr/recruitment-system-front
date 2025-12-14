import React, { useState } from 'react';
import {
    Users,
    Star,
    Plus,
    Trash2,
    MessageSquare,
} from 'lucide-react';

export default function HRInterviewForm({ formData, updateFormData }) {
    const [customQuestions, setCustomQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        category: 'behavioral',
        importance: 'medium',
    });

    const interviewOptions = [
        {
            id: 'ai-conducted',
            title: 'AI-Conducted HR Interview',
            description: 'AI conducts cultural fit interview and scores responses',
            icon: '🤖',
            features: ['Standardized scoring', 'Fast scheduling', 'Bias-aware evaluation'],
        },
        {
            id: 'hr-conducted',
            title: 'HR Representative + AI Assistance',
            description: 'HR conducts; AI recommends questions and generates evaluation report',
            icon: '🧑‍💼',
            features: ['Human context', 'AI assistance', 'Structured report'],
        },
    ];

    const questionCategories = [
        { id: 'behavioral', name: 'Behavioral', icon: '💬' },
        { id: 'culture', name: 'Culture', icon: '🏢' },
        { id: 'leadership', name: 'Leadership', icon: '🎯' },
        { id: 'motivation', name: 'Motivation', icon: '⚡' },
    ];

    const sampleQuestions = [
        {
            id: 1,
            text: 'Tell me about a time you handled a conflict within a team.',
            category: 'behavioral',
            importance: 'high',
        },
        {
            id: 2,
            text: 'What motivates you the most in your work?',
            category: 'motivation',
            importance: 'medium',
        },
        {
            id: 3,
            text: 'Describe your ideal work environment and team culture.',
            category: 'culture',
            importance: 'medium',
        },
    ];

    const handleInterviewTypeSelect = (typeId) => {
        updateFormData({ hrInterviewType: typeId });
        if (typeId === 'ai-conducted') {
            setCustomQuestions([]);
        }
    };

    const addCustomQuestion = () => {
        if (!newQuestion.text.trim()) return;

        const q = {
            id: Date.now(),
            text: newQuestion.text,
            category: newQuestion.category,
            importance: newQuestion.importance,
        };

        const updated = [...customQuestions, q];
        setCustomQuestions(updated);
        updateFormData({ hrInterviewQuestions: updated });

        setNewQuestion({ text: '', category: 'behavioral', importance: 'medium' });
    };

    const removeQuestion = (id) => {
        const updated = customQuestions.filter((q) => q.id !== id);
        setCustomQuestions(updated);
        updateFormData({ hrInterviewQuestions: updated });
    };

    const addSample = (question) => {
        const q = { ...question, id: Date.now() };
        const updated = [...customQuestions, q];
        setCustomQuestions(updated);
        updateFormData({ hrInterviewQuestions: updated });
    };

    return (
        <div className="space-y-8">
            {/* Interview Type Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-4">
                        <Users className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">HR Interview Setup</h3>
                        <p className="text-sm text-gray-600 mt-1">Choose how the HR/cultural fit interview will be conducted</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {interviewOptions.map((option) => {
                        const isSelected = formData.hrInterviewType === option.id;

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleInterviewTypeSelect(option.id)}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isSelected ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'
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
                                            <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                {isSelected && (
                                    <div className="mt-4 p-3 bg-pink-100 rounded-lg">
                                        <p className="text-sm text-pink-800 font-medium">✅ Selected</p>
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
                    <Star className="w-6 h-6 text-yellow-600 mr-3" />
                    <h3 className="text-lg font-bold text-gray-800">Evaluation Criteria</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select evaluation criteria for HR interview:
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { id: 'communication', label: 'Communication Skills', icon: '💬' },
                                { id: 'teamwork', label: 'Teamwork & Collaboration', icon: '👥' },
                                { id: 'adaptability', label: 'Adaptability', icon: '🔄' },
                                { id: 'problem-solving', label: 'Problem-Solving Approach', icon: '🧩' },
                                { id: 'leadership', label: 'Leadership Potential', icon: '🎯' },
                                { id: 'cultural-fit', label: 'Cultural Fit', icon: '🏢' },
                                { id: 'motivation', label: 'Motivation & Drive', icon: '⚡' },
                                { id: 'emotional-intelligence', label: 'Emotional Intelligence', icon: '❤️' },
                            ].map((criteria) => (
                                <label key={criteria.id} className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.hrEvaluationCriteria?.includes(criteria.id) || false}
                                        onChange={(e) => {
                                            const current = formData.hrEvaluationCriteria || [];
                                            const updated = e.target.checked
                                                ? [...current, criteria.id]
                                                : current.filter((id) => id !== criteria.id);
                                            updateFormData({ hrEvaluationCriteria: updated });
                                        }}
                                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                                    />
                                    <span className="ml-3 text-xl mr-3">{criteria.icon}</span>
                                    <span className="text-gray-700">{criteria.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Company Culture Values to Assess</label>
                        <textarea
                            value={formData.cultureValues || ''}
                            onChange={(e) => updateFormData({ cultureValues: e.target.value })}
                            placeholder="Enter your company's core values (e.g., Innovation, Collaboration, Customer Focus)..."
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <p className="mt-1 text-sm text-gray-500">AI will evaluate candidates against these values</p>
                    </div>
                </div>
            </div>

            {/* Question Setup */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                        <MessageSquare className="w-6 h-6 text-pink-600 mr-3" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">HR Interview Questions</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Add questions now (we will generate additional questions later if needed)
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-600">
                        Questions: <span className="font-bold text-pink-600">{customQuestions.length}</span>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <h4 className="font-bold text-gray-800 mb-4">Add HR Interview Question</h4>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                            <textarea
                                value={newQuestion.text}
                                onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                placeholder="Enter HR interview question..."
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                                <select
                                    value={newQuestion.importance}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, importance: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={addCustomQuestion}
                            disabled={!newQuestion.text.trim()}
                            className="flex items-center justify-center w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add Question
                        </button>
                    </div>
                </div>

                {(
                    <div className="mb-6">
                        <h4 className="font-bold text-gray-800 mb-4">Sample HR Questions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sampleQuestions.map((question) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-start mb-3">
                                        <span className="text-xl mr-3">{questionCategories.find((c) => c.id === question.category)?.icon}</span>
                                        <p className="text-gray-800">{question.text}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{questionCategories.find((c) => c.id === question.category)?.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => addSample(question)}
                                            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                                        >
                                            + Add to Interview
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {customQuestions.length > 0 && (
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4">Your HR Interview Questions</h4>
                        <div className="space-y-3">
                            {customQuestions.map((question) => (
                                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2">
                                                <span className="text-xl mr-3">{questionCategories.find((c) => c.id === question.category)?.icon}</span>
                                                <p className="text-gray-800">{question.text}</p>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600 ml-9">
                                                <span className="px-2 py-1 bg-gray-100 rounded mr-3">{question.importance}</span>
                                                <span>{questionCategories.find((c) => c.id === question.category)?.name}</span>
                                            </div>
                                        </div>
                                        <button type="button" onClick={() => removeQuestion(question.id)} className="ml-4 text-red-600 hover:text-red-700">
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            {/* Interview Settings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-6">HR Interview Settings</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interview Duration (Minutes) *</label>
                        <select
                            value={formData.hrInterviewDuration || '45'}
                            onChange={(e) => updateFormData({ hrInterviewDuration: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="30">30 minutes</option>
                            <option value="45">45 minutes</option>
                            <option value="60">60 minutes</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Interview Format</label>
                        <select
                            value={formData.hrInterviewFormat || 'conversational'}
                            onChange={(e) => updateFormData({ hrInterviewFormat: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="conversational">Conversational</option>
                            <option value="structured">Structured Q&A</option>
                            <option value="scenario-based">Scenario-Based</option>
                            <option value="mixed">Mixed Format</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Candidates to advance after this phase</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.hrInterviewCandidatesToAdvance || 3}
                            onChange={(e) => updateFormData({ hrInterviewCandidatesToAdvance: parseInt(e.target.value) })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Decision Timeline</label>
                        <select
                            value={formData.hrDecisionTimeline || '48'}
                            onChange={(e) => updateFormData({ hrDecisionTimeline: e.target.value })}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        >
                            <option value="24">24 hours</option>
                            <option value="48">48 hours</option>
                            <option value="72">72 hours</option>
                            <option value="5">5 business days</option>
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notes for HR Interviewers</label>
                    <textarea
                        value={formData.hrInterviewerNotes || ''}
                        onChange={(e) => updateFormData({ hrInterviewerNotes: e.target.value })}
                        placeholder="Specific instructions, red flags to watch for, culture points to emphasize..."
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>
            </div>
        </div>
    );
}
