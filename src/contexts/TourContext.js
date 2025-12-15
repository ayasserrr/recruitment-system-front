import React, { createContext, useState, useContext, useEffect } from 'react';

const TourContext = createContext();

export function TourProvider({ children }) {
    const [showTour, setShowTour] = useState(false);
    const [tourPreference, setTourPreference] = useState(() => {
        // Check localStorage for saved preference
        const savedPreference = localStorage.getItem('showTourOnLogin');
        return savedPreference === null ? true : savedPreference !== 'false';
    });

    useEffect(() => {
        // Update localStorage when tour preference changes
        if (tourPreference === false) {
            localStorage.setItem('showTourOnLogin', 'false');
        } else {
            localStorage.removeItem('showTourOnLogin');
        }
    }, [tourPreference]);

    const startTour = () => {
        setShowTour(true);
    };

    const endTour = () => {
        setShowTour(false);
    };

    const toggleTourPreference = () => {
        setTourPreference(!tourPreference);
    };

    const shouldShowTourOnLogin = () => {
        return tourPreference;
    };

    return (
        <TourContext.Provider value={{
            showTour,
            showTourOnLogin: tourPreference,
            startTour,
            endTour,
            toggleTourPreference,
            shouldShowTourOnLogin
        }}>
            {children}
        </TourContext.Provider>
    );
}

export function useTour() {
    const context = useContext(TourContext);
    if (context === undefined) {
        throw new Error('useTour must be used within a TourProvider');
    }
    return context;
}
