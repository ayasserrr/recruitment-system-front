import React from 'react';
import { CheckCircle } from 'lucide-react';

export default function StepProgress({ currentStep, steps }) {
    return (
        <div className="w-full max-w-4xl mx-auto mb-8">
            <div className="flex items-center justify-between relative">
                {/* Progress line */}
                <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 -z-10"></div>
                <div
                    className="absolute top-6 left-6 h-1 bg-blue-600 -z-10 transition-all duration-300"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step, index) => {
                    const isCompleted = index < currentStep - 1;
                    const isActive = index === currentStep - 1;
                    const stepNumber = index + 1;

                    return (
                        <div key={step.id} className="flex flex-col items-center relative">
                            <div
                                className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted
                                    ? 'bg-blue-600 border-blue-600'
                                    : isActive
                                        ? 'bg-white border-blue-600'
                                        : 'bg-white border-gray-300'
                                    }`}
                            >
                                {isCompleted ? (
                                    <CheckCircle className="w-6 h-6 text-white" />
                                ) : (
                                    <span
                                        className={`text-lg font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'
                                            }`}
                                    >
                                        {stepNumber}
                                    </span>
                                )}
                            </div>
                            <div className="mt-3 text-center">
                                <p
                                    className={`text-sm font-medium ${isActive || isCompleted ? 'text-blue-600' : 'text-gray-500'
                                        }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{step.subtitle}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
