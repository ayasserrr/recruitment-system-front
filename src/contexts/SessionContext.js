import React, { createContext, useContext, useEffect, useState } from 'react';
import { checkSessionTimeout, startSessionTimeout, isAuthenticated } from '../api/authService';

const SessionContext = createContext();

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }) => {
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [sessionWarning, setSessionWarning] = useState('');

  useEffect(() => {
    console.log('SessionContext: Setting up session monitoring');

    // Check session status on mount and periodically
    const checkSession = () => {
      console.log('SessionContext: Checking session status');
      if (isAuthenticated()) {
        const sessionExpired = checkSessionTimeout();
        if (!sessionExpired) {
          setIsSessionValid(true);
          console.log('SessionContext: Session is valid');
        }
      } else {
        setIsSessionValid(false);
        console.log('SessionContext: No valid session found');
      }
    };

    // Initial check immediately
    checkSession();

    // Set up periodic checks (every 30 seconds for 2-minute timeout)
    const interval = setInterval(checkSession, 30 * 1000);
    console.log('SessionContext: Set up interval check every 30 seconds');

    // Check on visibility change (when user switches tabs)
    const handleVisibilityChange = () => {
      console.log('SessionContext: Visibility changed, checking session');
      if (!document.hidden) {
        checkSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check on focus (when user clicks back to window)
    const handleFocus = () => {
      console.log('SessionContext: Window focused, checking session');
      checkSession();
    };

    window.addEventListener('focus', handleFocus);

    // Cleanup
    return () => {
      console.log('SessionContext: Cleaning up session monitoring');
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const value = {
    isSessionValid,
    sessionWarning,
    refreshSession: checkSessionTimeout,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionContext;
