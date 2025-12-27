
import React, { useState, useEffect } from 'react';
import { Screen, User, ThemeSettings } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ChatScreen from './components/ChatScreen';
import AssessmentScreen from './components/AssessmentScreen';
import ProfileScreen from './components/ProfileScreen';
import FeaturesScreen from './components/FeaturesScreen';

const STORAGE_PREFIX = 'psychai_user_';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [user, setUser] = useState<User | null>(null);

  // Apply theme and accent color
  useEffect(() => {
    const applyTheme = (settings: ThemeSettings) => {
      // Dark mode toggle
      if (settings.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      // Accent color
      document.documentElement.style.setProperty('--color-primary', settings.accentColor);
      
      // Helper for RGB values for filters/shadows if needed
      // (Simplified: just setting the hex is usually enough for Tailwind)
    };

    if (user?.theme) {
      applyTheme(user.theme);
    } else {
      // Default theme
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme({ mode: isDark ? 'dark' : 'light', accentColor: '#135bec' });
    }
  }, [user?.theme]);

  const handleStart = () => setCurrentScreen(Screen.Auth);
  
  const handleLogin = (userData: User) => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${userData.phoneNumber}`);
    if (saved) {
        const savedUser = JSON.parse(saved);
        setUser(savedUser);
    } else {
        const newUser: User = { 
          ...userData, 
          history: [],
          theme: { mode: 'dark', accentColor: '#135bec' } // Default to dark for premium feel
        };
        setUser(newUser);
        localStorage.setItem(`${STORAGE_PREFIX}${userData.phoneNumber}`, JSON.stringify(newUser));
    }
    setCurrentScreen(Screen.Chat);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen(Screen.Welcome);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(`${STORAGE_PREFIX}${updatedUser.phoneNumber}`, JSON.stringify(updatedUser));
  };

  const clearHistory = () => {
    if (user) {
        const updatedUser = { ...user, history: [] };
        updateUser(updatedUser);
        alert('حافظه گفتگو با موفقیت پاک شد.');
    }
  };

  const navigateToAssessments = () => setCurrentScreen(Screen.Assessments);
  const navigateToProfile = () => setCurrentScreen(Screen.Profile);
  const navigateToFeatures = () => setCurrentScreen(Screen.Features);
  const backToChat = () => setCurrentScreen(Screen.Chat);
  const backToWelcome = () => setCurrentScreen(Screen.Welcome);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors duration-500">
      {currentScreen === Screen.Welcome && (
        <WelcomeScreen onStart={handleStart} onShowFeatures={navigateToFeatures} />
      )}
      
      {currentScreen === Screen.Auth && (
        <AuthScreen onLogin={handleLogin} />
      )}
      
      {currentScreen === Screen.Chat && user && (
        <ChatScreen 
          user={user} 
          onLogout={handleLogout} 
          onNavigateToAssessments={navigateToAssessments} 
          onNavigateToProfile={navigateToProfile}
          onUpdateUser={updateUser}
        />
      )}

      {currentScreen === Screen.Assessments && (
        <AssessmentScreen onBack={backToChat} onNavigateToProfile={navigateToProfile} />
      )}

      {currentScreen === Screen.Profile && user && (
        <ProfileScreen 
          user={user} 
          onBack={backToChat} 
          onLogout={handleLogout} 
          onClearHistory={clearHistory}
          onUpdateTheme={(theme) => updateUser({ ...user, theme })}
        />
      )}

      {currentScreen === Screen.Features && (
        <FeaturesScreen onBack={user ? backToChat : backToWelcome} />
      )}
    </div>
  );
};

export default App;
