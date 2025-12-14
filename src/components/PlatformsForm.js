import React from 'react';
import { Globe, Calendar, Check, Briefcase, Search, Building } from 'lucide-react';

export default function PlatformsForm({ formData, updateFormData }) {
    const platforms = [
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: 'briefcase',
            description: 'Professional network'
        },
        {
            id: 'indeed',
            name: 'Indeed',
            icon: 'search',
            description: 'Job search engine'
        },
        {
            id: 'glassdoor',
            name: 'Glassdoor',
            icon: 'building',
            description: 'Company reviews'
        },
    ];

    const iconComponents = {
        briefcase: Briefcase,
        search: Search,
        building: Building
    };

    const handlePlatformToggle = (platformId) => {
        const currentPlatforms = formData.selectedPlatforms || [];
        const newPlatforms = currentPlatforms.includes(platformId)
            ? currentPlatforms.filter((id) => id !== platformId)
            : [...currentPlatforms, platformId];

        updateFormData({ selectedPlatforms: newPlatforms });
    };

    return (
        <div className="space-y-8">
            {/* Platforms Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Posting Platforms</h3>
                        <p className="text-sm text-gray-600 mt-1">Select where you want to post this job</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {platforms.map((platform) => {
                        const isSelected = formData.selectedPlatforms?.includes(platform.id);

                        return (
                            <div
                                key={platform.id}
                                onClick={() => handlePlatformToggle(platform.id)}
                                className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-accent-300'
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-2xl">
                                        {React.createElement(iconComponents[platform.icon], {
                                            className: 'w-6 h-6',
                                            style: {
                                                background: 'linear-gradient(90deg, #667585 0%, #92BBE8 100%)',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                display: 'inline-block'
                                            }
                                        })}
                                    </div>
                                    {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                                </div>
                                <h4 className="font-semibold text-gray-800">{platform.name}</h4>
                                <p className="text-sm text-gray-500 mt-1">{platform.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Scheduling Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Scheduling</h3>
                        <p className="text-sm text-gray-600 mt-1">Set posting timeline only (CV collection window)</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Posting Start Date *
                        </label>
                        <div className="flex items-center">
                            <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <input
                                type="date"
                                value={formData.postingStartDate || ''}
                                onChange={(e) => updateFormData({ postingStartDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            CV Collection End Date *
                        </label>
                        <div className="flex items-center">
                            <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <input
                                type="date"
                                value={formData.postingEndDate || ''}
                                onChange={(e) => updateFormData({ postingEndDate: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
