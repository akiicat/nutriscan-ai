import React, { useState, useCallback, useEffect } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, googleProvider } from './services/firebase';
import { FoodItem, View, Language, User } from './types';
import Header from './components/Header';
import ScanView from './components/ScanView';
import HistoryView from './components/HistoryView';
import FoodDetailView from './components/FoodDetailView';
import LoginView from './components/LoginView';
import Footer from './components/Footer';
import { MOCK_HISTORY, TRANSLATIONS } from './constants';
import { translateAnalysis } from './services/geminiService';


function App() {
  const [currentView, setCurrentView] = useState<View>('scan');
  const [history, setHistory] = useState<FoodItem[]>(MOCK_HISTORY);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [isTranslating, setIsTranslating] = useState(false);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const t = TRANSLATIONS[language];

  // Handle Firebase Auth State Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || 'https://ui-avatars.com/api/?name=User'
        };
        setUser(appUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (view: View) => {
    setSelectedFoodItem(null);
    setCurrentView(view);
  };

  const handleAddFoodItem = useCallback((item: FoodItem) => {
    setHistory(prevHistory => [item, ...prevHistory]);
    setSelectedFoodItem(item);
    setCurrentView('detail');
  }, []);

  const handleSelectFoodItem = (item: FoodItem) => {
    setSelectedFoodItem(item);
    setCurrentView('detail');
  };

  const handleLanguageChange = async (newLang: Language) => {
    setLanguage(newLang);
    
    // Only translate if we have items
    if (history.length === 0) return;

    setIsTranslating(true);
    try {
      // Translate all items in history
      const updatedHistory = await Promise.all(
        history.map(async (item) => {
          const newAnalysis = await translateAnalysis(item.analysis, newLang);
          return { ...item, analysis: newAnalysis };
        })
      );
      
      setHistory(updatedHistory);

      // Update selected item if one is selected
      if (selectedFoodItem) {
        const updatedSelected = updatedHistory.find(h => h.id === selectedFoodItem.id);
        if (updatedSelected) {
          setSelectedFoodItem(updatedSelected);
        }
      }
    } catch (error) {
      console.error("Failed to translate history:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear history on logout if desired, or keep it local
      // setHistory([]); 
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'scan':
        return <ScanView onAnalysisComplete={handleAddFoodItem} language={language} t={t} />;
      case 'history':
        return <HistoryView history={history} onSelectItem={handleSelectFoodItem} t={t} />;
      case 'detail':
        if (selectedFoodItem) {
          return <FoodDetailView item={selectedFoodItem} t={t} />;
        }
        setCurrentView('history'); // Fallback if no item is selected
        return null;
      default:
        return <ScanView onAnalysisComplete={handleAddFoodItem} language={language} t={t} />;
    }
  };

  // Show Loading Spinner while checking auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show Login View if not authenticated
  if (!user) {
    return <LoginView t={t} onLogin={handleLogin} isLoggingIn={isLoggingIn} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigation} 
        language={language}
        setLanguage={handleLanguageChange}
        t={t}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <Footer t={t} />

      {/* Translation Loading Overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-gray-800 font-medium">Translating content...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;