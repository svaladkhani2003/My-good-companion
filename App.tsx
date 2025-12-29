
import React, { useState, useEffect } from 'react';
import { Screen, User, ThemeSettings } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import AuthScreen from './components/AuthScreen';
import ChatScreen from './components/ChatScreen';
import AssessmentScreen from './components/AssessmentScreen';
import ProfileScreen from './components/ProfileScreen';
import FeaturesScreen from './components/FeaturesScreen';

const STORAGE_PREFIX = 'psychai_user_v2_';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Welcome);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const applyTheme = (settings: ThemeSettings) => {
      if (settings.mode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      document.documentElement.style.setProperty('--color-primary', settings.accentColor);
    };

    if (user?.theme) {
      applyTheme(user.theme);
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme({ mode: isDark ? 'dark' : 'light', accentColor: '#135bec', personalityMode: 'kind', speechSpeed: 1 });
    }
  }, [user?.theme]);

  const handleStart = () => setCurrentScreen(Screen.Auth);
  
  const handleLogin = (userData: User) => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${userData.phoneNumber}`);
    if (saved) {
        setUser(JSON.parse(saved));
    } else {
        const newUser: User = { 
          ...userData, 
          history: [],
          sessions: [],
          theme: { mode: 'dark', accentColor: '#135bec', personalityMode: 'kind', speechSpeed: 1 },
          // Fix: Added responseTone: 'balanced' to fulfill AnalysisPreferences requirement
          analysisPreferences: { focusArea: 'general', depth: 'balanced', responseTone: 'balanced', thinkingEnabled: false, searchEnabled: true, modelSpeed: 'balanced' }
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

      {currentScreen === Screen.Assessments && user && (
        <AssessmentScreen 
          user={user} 
          onBack={backToChat} 
          onNavigateToProfile={navigateToProfile} 
          onUpdateUser={updateUser}
        />
      )}

      {currentScreen === Screen.Profile && user && (
        <ProfileScreen 
          user={user} 
          onBack={backToChat} 
          onLogout={handleLogout} 
          onClearHistory={() => updateUser({ ...user, history: [] })}
          onUpdateTheme={(theme) => updateUser({ ...user, theme })}
          onNavigateToAssessments={navigateToAssessments}
        />
      )}

      {currentScreen === Screen.Features && (
        <FeaturesScreen onBack={user ? backToChat : backToWelcome} />
      )}
    </div>
  );
};

export default App;
