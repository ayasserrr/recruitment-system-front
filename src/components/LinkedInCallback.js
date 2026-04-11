import React, { useState, useEffect } from 'react';
import { handleLinkedInCallback } from '../api/authService';

export default function LinkedInCallback() {
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Linking your company page... \u23f3');

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Extract code from URL parameters
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const error = urlParams.get('error');
                const errorDescription = urlParams.get('error_description');

                if (error) {
                    setStatus('error');
                    setMessage(`Authentication failed: ${errorDescription || error}`);
                    setTimeout(() => {
                        window.location.hash = '#settings';
                    }, 3000);
                    return;
                }

                if (!code) {
                    setStatus('error');
                    setMessage('No authorization code received from LinkedIn');
                    setTimeout(() => {
                        window.location.hash = '#settings';
                    }, 3000);
                    return;
                }

                setMessage('Linking your company page... \u23f3');

                // Send code to backend
                const result = await handleLinkedInCallback(code);

                if (result.success) {
                    setStatus('success');
                    setMessage('Company Connected Successfully \u2705');
                    setTimeout(() => {
                        // Trigger a page reload to refresh the connection status
                        window.location.hash = '#settings';
                        window.location.reload();
                    }, 2000);
                } else {
                    setStatus('error');
                    setMessage(`Failed to connect: ${result.error}`);
                    setTimeout(() => {
                        window.location.hash = '#settings';
                    }, 3000);
                }
            } catch (error) {
                console.error('LinkedIn callback error:', error);
                setStatus('error');
                setMessage('An unexpected error occurred during LinkedIn connection');
                setTimeout(() => {
                    window.location.hash = '#settings';
                }, 3000);
            }
        };

        handleCallback();
    }, []);

    const getStatusColor = () => {
        switch (status) {
            case 'loading':
                return 'text-blue-600';
            case 'success':
                return 'text-green-600';
            case 'error':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                );
            case 'success':
                return (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            case 'error':
                return (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        {getStatusIcon()}
                    </div>
                    <h1 className={`text-xl font-semibold mb-2 ${getStatusColor()}`}>
                        LinkedIn Connection
                    </h1>
                    <p className="text-gray-600">
                        {message}
                    </p>
                    {status === 'loading' && (
                        <p className="text-sm text-gray-500 mt-4">
                            You will be redirected automatically...
                        </p>
                    )}
                    {status !== 'loading' && (
                        <button
                            onClick={() => { window.location.hash = '#settings'; }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Return to Settings
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
