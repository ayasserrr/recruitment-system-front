import React from 'react';
import { Briefcase, MapPin, Target, GraduationCap, DollarSign, Calendar, Mail } from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';

export default function JobDetailsForm({ formData, updateFormData }) {
    const { isDarkMode } = useDarkMode();
    const seniorityLevels = [
        'Intern',
        'Entry Level',
        'Junior',
        'Mid Level',
        'Senior',
        'Lead',
        'Manager',
        'Director',
        'VP',
        'Executive'
    ];

    const employmentTypes = [
        'Full-time',
        'Part-time',
        'Contract',
        'Temporary',
        'Internship',
        'Volunteer'
    ];

    const educationLevels = [
        'High School',
        'Associate Degree',
        "Bachelor's Degree",
        "Master's Degree",
        'PhD',
        'No Formal Education Required'
    ];

    const currencies = ['USD ($)', 'EUR (€)', 'GBP (£)', 'CAD (C$)', 'AUD (A$)', 'EGP (E£)'];

    const handleInputChange = (field, value) => {
        updateFormData({ [field]: value });
    };

    const handleRemoteToggle = (checked) => {
        updateFormData({
            remoteAvailable: checked,
            ...(checked ? { city: '', country: '' } : {}),
        });
    };

    const handleArrayInput = (field, value) => {
        // Store the raw value for editing, but also parse and store as array for validation
        const parsedArray = parseArrayField(value);
        updateFormData({ [field]: parsedArray, [field + 'Raw']: value });
    };

    const parseArrayField = (value) => {
        // Parse both commas and newlines as separators
        if (typeof value === 'string') {
            return value
                .split(/[,\\n]/)
                .map((item) => item.trim())
                .filter((item) => item);
        }
        return Array.isArray(value) ? value : [];
    };

    const handleResponsibilitiesChange = (value) => {
        const responsibilities = value.split('\n').filter((line) => line.trim());
        updateFormData({ responsibilities, responsibilitiesRaw: value });
    };

    return (
        <div className="space-y-8">
            {/* Basic Information Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Job Title *
                        </label>
                        <input
                            type="text"
                            value={formData.jobTitle || ''}
                            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                            placeholder="e.g., Senior Frontend Developer"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Department
                        </label>
                        <input
                            type="text"
                            value={formData.department || ''}
                            onChange={(e) => handleInputChange('department', e.target.value)}
                            placeholder="e.g., Engineering"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Seniority Level *
                        </label>
                        <select
                            value={formData.seniorityLevel || ''}
                            onChange={(e) => handleInputChange('seniorityLevel', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        >
                            <option value="">Select Level</option>
                            {seniorityLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Employment Type *
                        </label>
                        <select
                            value={formData.employmentType || ''}
                            onChange={(e) => handleInputChange('employmentType', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        >
                            <option value="">Select Type</option>
                            {employmentTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Location Section */}
                <div className={`mt-6 pt-6 border-t transition-colors duration-300 ${isDarkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <h4 className={`text-lg font-semibold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Location</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                City {formData.remoteAvailable ? '' : '*'}
                            </label>
                            <input
                                type="text"
                                value={formData.city || ''}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                placeholder="e.g., Cairo"
                                disabled={!!formData.remoteAvailable}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white disabled:bg-slate-700 disabled:text-gray-400' : 'border-gray-300 disabled:bg-gray-100 disabled:text-gray-500'}`}
                                required={!formData.remoteAvailable}
                            />
                        </div>

                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Country {formData.remoteAvailable ? '' : '*'}
                            </label>
                            <input
                                type="text"
                                value={formData.country || ''}
                                onChange={(e) => handleInputChange('country', e.target.value)}
                                placeholder="e.g., Egypt"
                                disabled={!!formData.remoteAvailable}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white disabled:bg-slate-700 disabled:text-gray-400' : 'border-gray-300 disabled:bg-gray-100 disabled:text-gray-500'}`}
                                required={!formData.remoteAvailable}
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex items-center">
                        <input
                            type="checkbox"
                            id="remotePosition"
                            checked={formData.remoteAvailable || false}
                            onChange={(e) => handleRemoteToggle(e.target.checked)}
                            className="w-4 h-4 text-accent-600 rounded focus:ring-accent-500"
                        />
                        <label htmlFor="remotePosition" className={`ml-2 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Remote Position Available
                        </label>
                    </div>
                </div>
            </div>

            {/* Skills & Requirements Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Target className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Skills & Requirements</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Required Skills *
                        </label>
                        <textarea
                            value={formData.requiredSkillsRaw || (Array.isArray(formData.requiredSkills) ? formData.requiredSkills.join(', ') : '')}
                            onChange={(e) => handleArrayInput('requiredSkills', e.target.value)}
                            placeholder="e.g., React, TypeScript, JavaScript, Node.js (comma or line separated)"
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                        <p className={`mt-1 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Separate skills with commas or press Enter for new line</p>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Preferred Skills
                        </label>
                        <textarea
                            value={formData.preferredSkillsRaw || (Array.isArray(formData.preferredSkills) ? formData.preferredSkills.join(', ') : '')}
                            onChange={(e) => handleArrayInput('preferredSkills', e.target.value)}
                            placeholder="e.g., GraphQL, Docker, AWS (comma or line separated)"
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                        <p className={`mt-1 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Separate skills with commas or press Enter for new line</p>
                    </div>
                </div>
            </div>

            {/* Experience & Education Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Experience & Education</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Minimum Years of Experience *
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={formData.minExperience || 0}
                            onChange={(e) =>
                                handleInputChange('minExperience', parseInt(e.target.value))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Maximum Years of Experience *
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="50"
                            value={formData.maxExperience || 5}
                            onChange={(e) =>
                                handleInputChange('maxExperience', parseInt(e.target.value))
                            }
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Minimum Education Level *
                        </label>
                        <select
                            value={formData.minEducation || ''}
                            onChange={(e) => handleInputChange('minEducation', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        >
                            <option value="">Select education level</option>
                            {educationLevels.map((level) => (
                                <option key={level} value={level}>
                                    {level}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Field of Study (Preferred)
                        </label>
                        <input
                            type="text"
                            value={formData.fieldOfStudy || ''}
                            onChange={(e) => handleInputChange('fieldOfStudy', e.target.value)}
                            placeholder="e.g., Computer Science"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>
                </div>
            </div>

            {/* Job Description Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Job Description</h3>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Key Responsibilities *
                        </label>
                        <textarea
                            value={formData.responsibilitiesRaw || (Array.isArray(formData.responsibilities) ? formData.responsibilities.join('\n') : '')}
                            onChange={(e) => handleResponsibilitiesChange(e.target.value)}
                            placeholder={`Enter key responsibilities (one per line)
- Design and implement features
- Collaborate with team members
- Write clean, maintainable code`}
                            rows="4"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                        <p className={`mt-1 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enter each responsibility on a new line</p>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Full Job Description *
                        </label>
                        <textarea
                            value={formData.fullDescription || ''}
                            onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                            placeholder="Detailed description of the role, team, company culture, etc."
                            rows="6"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Compensation & Additional Info Section */}
            <div className={`rounded-xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                <div className="flex items-center mb-6">
                    <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-4">
                        <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-xl font-bold transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Compensation & Additional Info</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Currency
                        </label>
                        <select
                            value={formData.currency || 'USD ($)'}
                            onChange={(e) => handleInputChange('currency', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        >
                            {currencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Minimum Salary (Monthly)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.minSalary || 0}
                            onChange={(e) => handleInputChange('minSalary', parseInt(e.target.value))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Maximum Salary (Monthly)
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={formData.maxSalary || 5000}
                            onChange={(e) => handleInputChange('maxSalary', parseInt(e.target.value))}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Languages Required
                        </label>
                        <textarea
                            value={formData.languagesRaw || (Array.isArray(formData.languages) ? formData.languages.join(', ') : '')}
                            onChange={(e) => handleArrayInput('languages', e.target.value)}
                            placeholder="e.g., English (Fluent), Arabic (comma or line separated)"
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                        <p className={`mt-1 text-sm transition-colors duration-300 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Separate languages with commas or press Enter for new line</p>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Application Deadline
                        </label>
                        <div className="flex items-center">
                            <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <input
                                type="date"
                                value={formData.deadline || ''}
                                onChange={(e) => handleInputChange('deadline', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                            />
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Contact Email *
                        </label>
                        <div className="flex items-center">
                            <div className="flex items-center bg-gradient-to-r from-base-500 to-accent-500 w-10 h-10 rounded-lg justify-center mr-3">
                                <Mail className="w-5 h-5 text-white" />
                            </div>
                            <input
                                type="email"
                                value={formData.contactEmail || 'hr@company.com'}
                                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                                required
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className={`block text-sm font-medium mb-2 transition-colors duration-300 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Additional Notes
                        </label>
                        <textarea
                            value={formData.additionalNotes || ''}
                            onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                            placeholder="Any additional information about the position"
                            rows="3"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none transition ${isDarkMode ? 'bg-slate-800 border-slate-600 text-white' : 'border-gray-300'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
