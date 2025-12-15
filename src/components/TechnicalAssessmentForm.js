import React, { useMemo, useState } from 'react';
import { Brain, ClipboardList, Plus, Trash2, Settings2, Bot, Pencil, ClipboardCheck } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function TechnicalAssessmentForm({ formData, updateFormData }) {
    const { isDarkMode } = useDarkMode();
    const iconComponents = {
        'bot': Bot,
        'pencil': Pencil,
        'clipboard-check': ClipboardCheck
    };

    const [customQuestions, setCustomQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: '',
        type: 'multiple-choice',
        difficulty: 'medium',
        choices: ['', '', '', ''],
    });

    const assessmentOptions = [
        {
            id: 'ai-generated',
            title: 'AI-Generated Assessment',
            description: 'Let AI create a complete technical assessment based on job description',
            icon: 'bot',
            features: ['Auto-generates questions', 'Matches skill levels', 'Includes coding challenges'],
        },
        {
            id: 'custom',
            title: 'Custom Assessment',
            description: 'Create your own technical assessment questions',
            icon: 'pencil',
            features: ['Full control over questions', 'Add your own coding tests', 'Custom scoring'],
        },
        {
            id: 'template',
            title: 'Use Template',
            description: 'Select from pre-built assessment templates',
            icon: 'clipboard-check',
            features: ['Pre-defined question banks', 'Industry-specific templates', 'Quick setup'],
        },
    ];

    const questionTypes = [
        { id: 'multiple-choice', name: 'Multiple Choice' },
        { id: 'coding-challenge', name: 'Coding Challenge' },
        { id: 'system-design', name: 'System Design' },
        { id: 'practical-task', name: 'Practical Task' },
        { id: 'essay', name: 'Essay Question' },
    ];

    const difficultyLevels = [
        { id: 'easy', name: 'Easy', color: 'bg-green-100 text-green-800' },
        { id: 'medium', name: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
        { id: 'hard', name: 'Hard', color: 'bg-orange-100 text-orange-800' },
        { id: 'expert', name: 'Expert', color: 'bg-red-100 text-red-800' },
    ];

    const sampleQuestions = useMemo(
        () => [
            {
                id: 1,
                text: 'Explain the difference between let, const, and var in JavaScript.',
                type: 'essay',
                difficulty: 'medium',
                points: 10,
            },
            {
                id: 2,
                text: 'Write a function to reverse a linked list.',
                type: 'coding-challenge',
                difficulty: 'hard',
                points: 20,
            },
            {
                id: 3,
                text: 'What is the time complexity of quicksort in the worst case?',
                type: 'multiple-choice',
                difficulty: 'easy',
                points: 5,
            },
        ],
        []
    );

    const handleAssessmentSelect = (optionId) => {
        updateFormData({
            assessmentType: optionId,
            ...(optionId === 'ai-generated' && {
                autoGenerateAssessment: true,
                assessmentQuestions: sampleQuestions,
            }),
            ...(optionId === 'custom' && {
                autoGenerateAssessment: false,
                assessmentQuestions: [],
            }),
            ...(optionId === 'template' && {
                autoGenerateAssessment: false,
                assessmentQuestions: [],
                templateTask:
                    formData.templateTask ||
                    'Build a small feature or task that represents real work for this role. Provide requirements, constraints, and expected output.',
            }),
        });

        if (optionId !== 'custom') {
            setCustomQuestions([]);
        }
    };

    const addCustomQuestion = () => {
        if (!newQuestion.text.trim()) return;

        const points =
            newQuestion.difficulty === 'easy'
                ? 5
                : newQuestion.difficulty === 'medium'
                    ? 10
                    : newQuestion.difficulty === 'hard'
                        ? 15
                        : 20;

        const question = {
            id: Date.now(),
            text: newQuestion.text,
            type: newQuestion.type,
            difficulty: newQuestion.difficulty,
            points,
            ...(newQuestion.type === 'multiple-choice'
                ? {
                    choices: Array.isArray(newQuestion.choices)
                        ? newQuestion.choices.map((x) => String(x || '').trim()).filter(Boolean)
                        : [],
                }
                : {}),
        };

        const updated = [...customQuestions, question];
        setCustomQuestions(updated);
        updateFormData({ assessmentQuestions: updated });

        setNewQuestion({ text: '', type: 'multiple-choice', difficulty: 'medium', choices: ['', '', '', ''] });
    };

    const updateChoice = (idx, value) => {
        const current = Array.isArray(newQuestion.choices) ? newQuestion.choices : [];
        const next = [...current];
        next[idx] = value;
        setNewQuestion({ ...newQuestion, choices: next });
    };

    const addChoiceField = () => {
        const current = Array.isArray(newQuestion.choices) ? newQuestion.choices : [];
        setNewQuestion({ ...newQuestion, choices: [...current, ''] });
    };

    const removeChoiceField = (idx) => {
        const current = Array.isArray(newQuestion.choices) ? newQuestion.choices : [];
        const next = current.filter((_, i) => i !== idx);
        setNewQuestion({ ...newQuestion, choices: next.length ? next : [''] });
    };

    const removeQuestion = (id) => {
        const updated = customQuestions.filter((q) => q.id !== id);
        setCustomQuestions(updated);
        updateFormData({ assessmentQuestions: updated });
    };

    const handleSampleQuestionAdd = (question) => {
        const q = { ...question, id: Date.now() };
        const updated = [...customQuestions, q];
        setCustomQuestions(updated);
        updateFormData({ assessmentQuestions: updated });
    };

    return (
        <div className="space-y-8">
            {/* Assessment Type Selection */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Technical Assessment Type</h3>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Choose how you want to create the technical assessment</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {assessmentOptions.map((option) => {
                        const isSelected = formData.assessmentType === option.id;

                        return (
                            <div
                                key={option.id}
                                onClick={() => handleAssessmentSelect(option.id)}
                                className={`border-2 rounded-xl p-6 cursor-pointer transition-all duration-200 ${isSelected
                                    ? isDarkMode ? 'border-accent-500 bg-slate-700' : 'border-accent-500 bg-gradient-to-br from-base-50 to-accent-50'
                                    : isDarkMode ? 'border-slate-600 hover:border-accent-400' : 'border-gray-200 hover:border-accent-300'
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
                                        <p className="text-sm font-medium bg-gradient-to-r from-base-700 to-accent-700 bg-clip-text text-transparent">
                                            {option.id === 'ai-generated'
                                                ? '✓ AI will generate assessment based on job description'
                                                : option.id === 'custom'
                                                    ? '✓ You can add custom questions below'
                                                    : '✓ Select from available templates'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {formData.assessmentType === 'ai-generated' && (
                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg mr-3 flex-shrink-0">
                            <ClipboardList className="w-4 h-4 text-white" />
                        </div>
                        <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Assessment Questions</h3>
                    </div>
                    <p className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Questions will be generated later. For now, you can continue and configure the rest of the requisition.
                    </p>
                </div>
            )}

            {/* If Custom is selected, show question builder */}
            {formData.assessmentType === 'custom' && (
                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <div className="flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg mr-3 flex-shrink-0">
                                <ClipboardList className="w-4 h-4 text-white" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Custom Assessment Builder</h3>
                                <p className={`text-sm mt-1 transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Add your own technical questions</p>
                            </div>
                        </div>
                        <div className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Questions: <span className="font-bold text-orange-600">{customQuestions.length}</span>
                        </div>
                    </div>

                    {/* Add Question Form */}
                    <div className={`rounded-lg p-6 mb-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-800' : 'bg-gray-50'}`}>
                        <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Add New Question</h4>

                        <div className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Question Text *</label>
                                <textarea
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                    placeholder="Enter your question here..."
                                    rows="3"
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Question Type</label>
                                    <select
                                        value={newQuestion.type}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                    >
                                        {questionTypes.map((type) => (
                                            <option key={type.id} value={type.id}>
                                                {type.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {newQuestion.type === 'multiple-choice' && (
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choices</label>
                                        <div className="space-y-2">
                                            {(Array.isArray(newQuestion.choices) ? newQuestion.choices : []).map((choice, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={choice}
                                                        onChange={(e) => updateChoice(idx, e.target.value)}
                                                        placeholder={`Choice ${idx + 1}`}
                                                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeChoiceField(idx)}
                                                        className={`px-3 py-2 border rounded-lg font-medium transition-colors ${isDarkMode ? 'border-slate-600 text-gray-300 hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-accent-50'}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}

                                            <button
                                                type="button"
                                                onClick={addChoiceField}
                                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                            >
                                                + Add another choice
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Difficulty Level</label>
                                    <select
                                        value={newQuestion.difficulty}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                    >
                                        {difficultyLevels.map((level) => (
                                            <option key={level.id} value={level.id}>
                                                {level.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addCustomQuestion}
                                disabled={!newQuestion.text.trim()}
                                className={`flex items-center justify-center w-full font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700 text-white' : 'bg-orange-600 hover:bg-orange-700 text-white'}`}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add Question
                            </button>
                        </div>
                    </div>

                    {/* Sample Questions */}
                    <div className="mb-6">
                        <h4 className={`font-bold mb-4 transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Sample Questions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {sampleQuestions.map((question) => (
                                <div key={question.id} className={`border rounded-lg p-4 transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <p className={`transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{question.text}</p>
                                        <span
                                            className={`px-2 py-1 rounded text-xs font-medium ${difficultyLevels.find((d) => d.id === question.difficulty)?.color
                                                }`}
                                        >
                                            {question.difficulty}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className={`text-sm capitalize transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {question.type.replace('-', ' ')} • {question.points} points
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleSampleQuestionAdd(question)}
                                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            + Add to Assessment
                                        </button>
                                    </div>
                                </div>
                            ))}
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
                                                {question.type === 'multiple-choice' && Array.isArray(question.choices) && question.choices.length > 0 && (
                                                    <div className="mb-2">
                                                        <p className={`text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Choices:</p>
                                                        <ul className="mt-1 space-y-1">
                                                            {question.choices.map((choice, idx) => (
                                                                <li key={idx} className={`text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>- {choice}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className={`flex items-center text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <span
                                                        className={`px-2 py-1 rounded mr-3 ${difficultyLevels.find((d) => d.id === question.difficulty)?.color
                                                            }`}
                                                    >
                                                        {question.difficulty}
                                                    </span>
                                                    <span className="capitalize">{question.type.replace('-', ' ')}</span>
                                                    <span className="mx-3">•</span>
                                                    <span>{question.points} points</span>
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
            )}

            {/* If Template is selected, show editable template task */}
            {formData.assessmentType === 'template' && (
                <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                            <ClipboardList className="w-5 h-5 text-white" />
                        </div>
                        <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Template Task</h3>
                    </div>
                    <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sample Task (Editable)</label>
                    <textarea
                        value={formData.templateTask || ''}
                        onChange={(e) => updateFormData({ templateTask: e.target.value })}
                        rows="6"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                    />
                </div>
            )}

            {/* Assessment Settings */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                        <Settings2 className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Assessment Settings</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Limit (minutes)</label>
                        <input
                            type="number"
                            min="15"
                            max="240"
                            value={formData.assessmentTimeLimit || 60}
                            onChange={(e) => updateFormData({ assessmentTimeLimit: parseInt(e.target.value) })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Candidates to advance after this phase</label>
                        <input
                            type="number"
                            min="1"
                            value={formData.assessmentCandidatesToAdvance || 10}
                            onChange={(e) => updateFormData({ assessmentCandidatesToAdvance: parseInt(e.target.value) })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Max Attempts</label>
                        <select
                            value={formData.maxAttempts || '1'}
                            onChange={(e) => updateFormData({ maxAttempts: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            <option value="1">1 attempt</option>
                            <option value="2">2 attempts</option>
                            <option value="3">3 attempts</option>
                            <option value="unlimited">Unlimited</option>
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>Assessment Language</label>
                        <select
                            value={formData.assessmentLanguage || 'English'}
                            onChange={(e) => updateFormData({ assessmentLanguage: e.target.value })}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            <option value="English">English</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}
