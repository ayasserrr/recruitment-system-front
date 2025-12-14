import React, { useEffect, useState } from 'react';
import StepProgress from './StepProgress';
import JobDetailsForm from './JobDetailsForm';
import PlatformsForm from './PlatformsForm';
import TechnicalAssessmentForm from './TechnicalAssessmentForm';
import TechnicalInterviewForm from './TechnicalInterviewForm';
import HRInterviewForm from './HRInterviewForm';
import ReviewSubmitForm from './ReviewSubmitForm';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

export default function MultiStepForm({ onSubmitRequisition, onDone }) {
    const initialFormData = {
        // Job Details
        jobTitle: '',
        department: '',
        seniorityLevel: '',
        employmentType: '',
        city: '',
        country: '',
        remoteAvailable: false,
        requiredSkills: [],
        preferredSkills: [],
        minExperience: 0,
        maxExperience: 5,
        minEducation: '',
        fieldOfStudy: '',
        responsibilities: [],
        fullDescription: '',
        currency: 'USD ($)',
        minSalary: 0,
        maxSalary: 5000,
        languages: [],
        deadline: '',
        contactEmail: 'hr@company.com',
        additionalNotes: '',

        // Platforms & Interview
        selectedPlatforms: [],
        postingStartDate: '',
        postingEndDate: '',

        // Technical Assessment
        assessmentType: 'ai-generated',
        assessmentQuestions: [],
        assessmentTimeLimit: 60,
        assessmentCandidatesToAdvance: 10,
        maxAttempts: '1',
        assessmentLanguage: 'English',
        templateTask: '',

        // Technical Interview
        technicalInterviewType: 'ai-conducted',
        technicalInterviewQuestions: [],
        aiEvaluationCriteria: [],
        aiFeedbackLevel: 'detailed',
        numberOfInterviewers: '1',
        scoringSystem: '1-5',
        technicalInterviewDuration: '45',
        technicalInterviewCandidatesToAdvance: 5,
        interviewerNotes: '',

        // HR Interview
        hrInterviewType: 'ai-conducted',
        hrInterviewQuestions: [],
        hrEvaluationCriteria: [],
        cultureValues: '',
        hrInterviewDuration: '45',
        hrInterviewFormat: 'conversational',
        hrInterviewCandidatesToAdvance: 3,
        hrDecisionTimeline: '48',
        hrInterviewerNotes: '',
    };

    const [currentStep, setCurrentStep] = useState(1);
    const [stepError, setStepError] = useState('');
    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        try {
            const raw = localStorage.getItem('jobRequisitionDraft');
            if (!raw) return;

            const draft = JSON.parse(raw);
            if (!draft || typeof draft !== 'object') return;

            const normalizedDraft = { ...draft };
            if (Array.isArray(normalizedDraft.minEducation)) {
                normalizedDraft.minEducation = normalizedDraft.minEducation[0] || '';
            }

            if (!String(formData.jobTitle || '').trim()) {
                setFormData((prev) => ({ ...prev, ...normalizedDraft }));
            }
        } catch {
            // ignore
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const steps = [
        { id: 1, title: 'Job Details', subtitle: 'Basic information & requirements' },
        { id: 2, title: 'Platforms & Interview', subtitle: 'Posting & scheduling' },
        { id: 3, title: 'Technical Assessment', subtitle: 'Test configuration' },
        { id: 4, title: 'Technical Interview', subtitle: 'Technical evaluation setup' },
        { id: 5, title: 'HR Interview', subtitle: 'Cultural fit assessment' },
        { id: 6, title: 'Review & Submit', subtitle: 'Final confirmation' },
    ];

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
        if (stepError) setStepError('');
    };

    const validateStep = (step) => {
        const errors = [];

        if (step === 1) {
            if (!String(formData.jobTitle || '').trim()) errors.push('Job Title is required.');
            if (!String(formData.seniorityLevel || '').trim()) errors.push('Seniority Level is required.');
            if (!String(formData.employmentType || '').trim()) errors.push('Employment Type is required.');
            if (!formData.remoteAvailable) {
                if (!String(formData.city || '').trim()) errors.push('City is required.');
                if (!String(formData.country || '').trim()) errors.push('Country is required.');
            }
            if (!Array.isArray(formData.requiredSkills) || formData.requiredSkills.length === 0) errors.push('Required Skills are required.');
            if (!String(formData.minEducation || '').trim()) errors.push('Minimum Education Level is required.');
            if (!Array.isArray(formData.responsibilities) || formData.responsibilities.length === 0) errors.push('Key Responsibilities are required.');
            if (!String(formData.fullDescription || '').trim()) errors.push('Full Job Description is required.');
            if (!String(formData.contactEmail || '').trim()) errors.push('Contact Email is required.');
        }

        if (step === 2) {
            if (!Array.isArray(formData.selectedPlatforms) || formData.selectedPlatforms.length === 0) errors.push('Select at least one posting platform.');
            if (!String(formData.postingStartDate || '').trim()) errors.push('Posting Start Date is required.');
            if (!String(formData.postingEndDate || '').trim()) errors.push('CV Collection End Date is required.');
            if (String(formData.postingStartDate || '').trim() && String(formData.postingEndDate || '').trim()) {
                const start = new Date(formData.postingStartDate);
                const end = new Date(formData.postingEndDate);
                if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime()) && end < start) {
                    errors.push('CV Collection End Date must be after Posting Start Date.');
                }
            }
        }

        if (step === 3) {
            if (!String(formData.assessmentType || '').trim()) errors.push('Assessment Type is required.');
            if (formData.assessmentType === 'custom' && (!Array.isArray(formData.assessmentQuestions) || formData.assessmentQuestions.length === 0)) {
                errors.push('Add at least one assessment question (Custom Assessment).');
            }
            if (formData.assessmentType === 'template' && !String(formData.templateTask || '').trim()) {
                errors.push('Template Task is required (Use Template).');
            }
        }

        if (step === 4) {
            if (!String(formData.technicalInterviewType || '').trim()) errors.push('Technical Interview Type is required.');
            if (!String(formData.technicalInterviewDuration || '').trim()) errors.push('Technical Interview Duration is required.');
        }

        if (step === 5) {
            if (!String(formData.hrInterviewType || '').trim()) errors.push('HR Interview Type is required.');
            if (!String(formData.hrInterviewDuration || '').trim()) errors.push('HR Interview Duration is required.');
        }

        return errors;
    };

    const currentStepErrors = validateStep(currentStep);
    const canContinue = currentStepErrors.length === 0;

    const nextStep = () => {
        const errors = validateStep(currentStep);
        if (errors.length > 0) {
            setStepError(errors[0]);
            return;
        }

        if (currentStep < steps.length) setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleEditStep = (stepId) => {
        setCurrentStep(stepId);
    };

    const handleSaveDraft = () => {
        try {
            localStorage.setItem('jobRequisitionDraft', JSON.stringify(formData));
            setStepError('Draft saved.');
        } catch {
            setStepError('Could not save draft.');
        }
    };

    const handleExport = () => {
        window.print();
    };

    const handleSubmit = () => {
        for (let step = 1; step <= 5; step += 1) {
            const errors = validateStep(step);
            if (errors.length > 0) {
                setStepError(errors[0]);
                setCurrentStep(step);
                return;
            }
        }

        if (typeof onSubmitRequisition === 'function') {
            onSubmitRequisition(formData);
        }

        try {
            localStorage.removeItem('jobRequisitionDraft');
        } catch {
            // ignore
        }

        setFormData(initialFormData);
        setCurrentStep(1);
        setStepError('');

        if (typeof onDone === 'function') {
            onDone();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <JobDetailsForm formData={formData} updateFormData={updateFormData} />;
            case 2:
                return <PlatformsForm formData={formData} updateFormData={updateFormData} />;
            case 3:
                return <TechnicalAssessmentForm formData={formData} updateFormData={updateFormData} />;
            case 4:
                return <TechnicalInterviewForm formData={formData} updateFormData={updateFormData} />;
            case 5:
                return <HRInterviewForm formData={formData} updateFormData={updateFormData} />;
            case 6:
                return (
                    <ReviewSubmitForm
                        formData={formData}
                        onEditStep={handleEditStep}
                        onSubmit={handleSubmit}
                        onSaveDraft={handleSaveDraft}
                        onExport={handleExport}
                    />
                );
            default:
                return <JobDetailsForm formData={formData} updateFormData={updateFormData} />;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Create New Job Requisition</h1>
                    <p className="text-slate-600">Follow the steps to capture the requisition requirements</p>
                </div>

                {/* Step Progress */}
                <StepProgress currentStep={currentStep} steps={steps} />

                {stepError && (
                    <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${stepError === 'Draft saved.' || stepError === 'Job requisition submitted.'
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-red-200 bg-red-50 text-red-800'
                        }`}>
                        {stepError}
                    </div>
                )}

                {/* Form Content */}
                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">{renderStep()}</div>

                {/* Navigation Buttons (hidden on review step) */}
                {currentStep !== 6 && (
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            {currentStep > 1 && (
                                <button type="button" onClick={prevStep} className="flex items-center text-slate-600 hover:text-slate-800 font-medium">
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    Back
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={handleSaveDraft}
                                className="flex items-center text-slate-600 hover:text-slate-800 font-medium"
                            >
                                <Save className="w-5 h-5 mr-2" />
                                Save Draft
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    if (!canContinue) {
                                        setStepError(currentStepErrors[0]);
                                        return;
                                    }
                                    nextStep();
                                }}
                                disabled={!canContinue}
                                className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {currentStep === steps.length - 1 ? 'Review & Submit' : 'Continue'}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Progress Indicator */}
                <div className="text-center mt-8">
                    <p className="text-sm text-slate-600">
                        Step {currentStep} of {steps.length} • {Math.round((currentStep / steps.length) * 100)}% Complete
                    </p>
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(currentStep / steps.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
