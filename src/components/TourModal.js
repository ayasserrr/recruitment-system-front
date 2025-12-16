import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, ArrowLeft, X } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTour } from '../contexts/TourContext';

const tourSteps = [
    {
        title: 'Welcome to HireFlow AI!',
        description: "Your intelligent recruitment platform powered by AI. Let's take a quick tour to show you how everything works.",
    },
    {
        title: 'Smart Job Posting',
        description: 'Create and manage job requisitions with AI-optimized descriptions and multi-platform posting to attract the best talent.',
    },
    {
        title: 'Technical Assessment',
        description: 'Evaluate candidates with comprehensive technical assessments and coding challenges to identify the best technical talent.',
    },
    {
        title: 'AI-Powered Candidate Analysis',
        description: 'Leverage semantic analysis and technical assessments to automatically screen and rank candidates based on your requirements.',
    },
    {
        title: 'Interview Management',
        description: 'Streamline technical and HR interviews with structured workflows, automated scheduling, and comprehensive evaluation tools.',
    },
    {
        title: 'Analytics & Insights',
        description: 'Get detailed analytics on recruitment metrics, candidate pipelines, and hiring performance to make data-driven decisions.',
    },
];

export default function TourModal({ isOpen, onClose, onComplete }) {
    const { isDarkMode } = useDarkMode();
    const { showTourOnLogin, toggleTourPreference } = useTour();
    const [currentStep, setCurrentStep] = useState(0);
    const modalRef = useRef(null);

    useEffect(() => {
        // Reset to first step when modal opens
        if (isOpen) {
            setCurrentStep(0);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            // Restore body scroll when modal closes
            document.body.style.overflow = 'unset';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        // Close modal if backdrop is clicked (but not if clicking on modal content)
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleNext = () => {
        if (currentStep < tourSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handlePrevious = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        onComplete();
    };

    const handleSkip = () => {
        onClose();
    };

    const handleDontShowAgainChange = (checked) => {
        // Update the tour preference in context
        // checked = true means "don't show again" = showTourOnLogin should be false
        if (checked !== !showTourOnLogin) {
            toggleTourPreference();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100 p-4 overflow-hidden">
            <div ref={modalRef} className="relative max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={handleSkip}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 z-10"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                {/* Content */}
                <div className="px-10 pt-12 pb-8 max-h-screen overflow-hidden">
                    {/* Title and Description */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
                            {tourSteps[currentStep].title}
                        </h2>
                        <p className="text-base text-gray-600 leading-relaxed px-4">
                            {tourSteps[currentStep].description}
                        </p>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex justify-center mb-8 space-x-1.5">
                        {tourSteps.map((_, index) => (
                            <div
                                key={index}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentStep
                                    ? 'w-6 bg-gradient-to-r from-base-500 to-accent-500'
                                    : index < currentStep
                                        ? 'w-1.5 bg-base-400'
                                        : 'w-1.5 bg-gray-200'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex space-x-4 mb-6">
                        {/* Previous Button */}
                        <button
                            onClick={handlePrevious}
                            disabled={currentStep === 0}
                            className={`flex items-center justify-center py-4 px-8 rounded-xl font-medium transition-all duration-200 ${currentStep === 0
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-base-500 to-accent-500 text-white hover:from-base-600 hover:to-accent-600'
                                }`}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Previous
                        </button>

                        {/* Next Button */}
                        <button
                            onClick={handleNext}
                            className="flex-1 flex items-center justify-center bg-gradient-to-r from-base-500 to-accent-500 text-white py-4 px-8 rounded-xl font-medium hover:from-base-600 hover:to-accent-600 transition-all duration-200"
                        >
                            {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>

                    {/* Don't Show Again Checkbox */}
                    <div className="flex items-center justify-center">
                        <input
                            type="checkbox"
                            id="dontShowAgain"
                            checked={!showTourOnLogin}
                            onChange={(e) => handleDontShowAgainChange(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <label
                            htmlFor="dontShowAgain"
                            className="ml-2 text-sm text-gray-600 cursor-pointer"
                        >
                            Don't show this tour again
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
