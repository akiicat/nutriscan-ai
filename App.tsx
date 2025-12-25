
import React, { useState, useCallback, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from './services/firebase';
import { uploadImage, saveFoodToDb, getFoodHistory, deleteFoodFromDb } from './services/dbService';
import { analyzeFoodImage } from './services/geminiService';
import { FoodItem, View, Language, User, UserTier } from './types';
import Header from './components/Header';
import ScanView from './components/ScanView';
import HistoryView from './components/HistoryView';
import FoodDetailView from './components/FoodDetailView';
import LoginView from './components/LoginView';
import HomeView from './components/HomeView';
import PricingView from './components/PricingView';
import Footer from './components/Footer';
import ConfirmModal from './components/ConfirmModal';
import { MOCK_HISTORY, TRANSLATIONS } from './constants';


function App() {
  const [currentView, setCurrentView] = useState<View>('scan');
  const [history, setHistory] = useState<FoodItem[]>([]);
  const [selectedFoodItem, setSelectedFoodItem] = useState<FoodItem | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false); // Toggle between Home and Login

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; itemId: string | null }>({
    isOpen: false,
    itemId: null
  });

  // Rescan Loading State
  const [isRescanning, setIsRescanning] = useState(false);

  const t = TRANSLATIONS[language];

  // Handle Firebase Auth State Changes and Load History
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Initialize user with 'free' tier by default logic (or fetch from DB in real app)
        // In a real app, we would fetch the 'tier' field from Firestore here.
        const appUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          picture: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.email || 'User'}`,
          tier: 'free', // Default to Free for registered users
          scanCount: 0 
        };
        setUser(appUser);
        setShowLogin(false); // Reset login visibility

        // Load history from Firestore
        try {
            const userHistory = await getFoodHistory(firebaseUser.uid);
            setHistory(userHistory);
        } catch (error) {
            console.error("Failed to load history:", error);
        }

      } else {
        // Do not reset user if they logged in as guest
        if (user?.id !== 'guest') {
           setUser(null);
           setHistory([]); // Clear history on logout
        }
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, [user?.id]);

  const handleNavigation = (view: View) => {
    setSelectedFoodItem(null);
    setCurrentView(view);
  };

  const handleAddFoodItem = useCallback(async (item: FoodItem, file?: File) => {
    // Optimistically update UI with the item (containing base64 or placeholder image)
    setHistory(prevHistory => [item, ...prevHistory]);
    setSelectedFoodItem(item);
    setCurrentView('detail');

    // If user is logged in (and not guest), upload image and save to Firestore
    if (user && user.id !== 'guest') {
        try {
            let finalItem = { ...item };

            // 1. Upload Image if exists
            if (file) {
                const downloadUrl = await uploadImage(user.id, file);
                finalItem.image = downloadUrl;
            }

            // 2. Save to Firestore
            await saveFoodToDb(user.id, finalItem);
            
            // 3. Update local state with the version having the remote URL
            // This ensures future renders use the efficient URL instead of base64
            setHistory(prev => prev.map(i => i.id === finalItem.id ? finalItem : i));
            if (selectedFoodItem?.id === finalItem.id) {
                setSelectedFoodItem(finalItem);
            }

        } catch (error) {
            console.error("Failed to save food item to cloud:", error);
            // Optionally show a toast notification here
        }
    }
  }, [user, selectedFoodItem?.id]);

  const handleSelectFoodItem = (item: FoodItem) => {
    setSelectedFoodItem(item);
    setCurrentView('detail');
  };

  const handleRequestDelete = (itemId: string) => {
    setDeleteModal({ isOpen: true, itemId });
  };

  const handleConfirmDelete = async () => {
    const itemId = deleteModal.itemId;
    if (!itemId) return;

    // Close Modal immediately
    setDeleteModal({ isOpen: false, itemId: null });

    // Optimistically remove from UI
    setHistory(prev => prev.filter(item => item.id !== itemId));
    
    // If currently viewing the deleted item, go back to history
    if (selectedFoodItem?.id === itemId) {
        setSelectedFoodItem(null);
        setCurrentView('history');
    }

    // If logged in user (not guest), delete from Firestore
    if (user && user.id !== 'guest') {
        try {
            await deleteFoodFromDb(user.id, itemId);
        } catch (error) {
            console.error("Failed to delete item from cloud:", error);
        }
    }
  };

  const handleRescanItem = async (item: FoodItem) => {
    setIsRescanning(true);
    try {
        let base64Data = "";
        
        // 1. Get Base64 Data
        if (item.image.startsWith('data:')) {
            base64Data = item.image.split(',')[1];
        } else {
            // It's a URL (Firebase Storage or other)
            // Fetch blob and convert to base64
            try {
                const response = await fetch(item.image, { mode: 'cors', credentials: 'omit' });
                if (!response.ok) throw new Error("Failed to fetch image");
                const blob = await response.blob();
                base64Data = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (err) {
                console.error("Error fetching image for rescan:", err);
                throw new Error("Could not retrieve image for re-analysis.");
            }
        }

        // 2. Analyze with current language
        const newAnalysis = await analyzeFoodImage(base64Data, language);

        // 3. Update Item
        const updatedItem = { ...item, analysis: newAnalysis };

        // 4. Update State
        setHistory(prev => prev.map(i => i.id === item.id ? updatedItem : i));
        setSelectedFoodItem(updatedItem);

        // 5. Save to DB if user
        if (user && user.id !== 'guest') {
            await saveFoodToDb(user.id, updatedItem);
        }
    } catch (error) {
        console.error("Rescan failed:", error);
        // Could implement a toast notification here
    } finally {
        setIsRescanning(false);
    }
  };

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  // Pricing Mock Logic
  const handleUpgrade = (tier: UserTier) => {
    if (user) {
        setUser({ ...user, tier: tier });
        alert(`Successfully upgraded to ${tier.toUpperCase()} plan!`);
        setCurrentView('scan'); // Go back to scan after upgrade
    }
  };

  const saveUserToFirestore = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      await setDoc(userRef, {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        photoURL: firebaseUser.photoURL,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      console.error("Error saving user to Firestore:", error);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Save or update user in Firestore
      if (result.user) {
        await saveUserToFirestore(result.user);
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        setLoginError("Domain not authorized for Google Login. Please use Guest Mode.");
      } else if (error.code === 'auth/popup-closed-by-user') {
        // User just closed popup, no need for big error
        setLoginError(null); 
      } else {
        setLoginError("Login failed. Please try again or continue as guest.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      console.error("Email login failed", error);
      let msg = "Login failed. Please check your credentials.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = "Invalid email or password.";
      }
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailSignup = async (email: string, pass: string) => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      // Save new user to Firestore
      if (result.user) {
        await saveUserToFirestore(result.user);
      }
    } catch (error: any) {
      console.error("Signup failed", error);
      let msg = "Signup failed.";
      if (error.code === 'auth/email-already-in-use') {
        msg = "Email is already in use.";
      } else if (error.code === 'auth/weak-password') {
        msg = "Password should be at least 6 characters.";
      }
      setLoginError(msg);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = () => {
    const guestUser: User = {
      id: 'guest',
      name: 'Guest User',
      email: 'guest@example.com',
      picture: 'https://ui-avatars.com/api/?name=Guest+User&background=random&color=fff',
      tier: 'guest',
      scanCount: 0
    };
    setUser(guestUser);
    setHistory(MOCK_HISTORY); // Load mock history for guest
    setLoginError(null);
  };

  const handleLogout = async () => {
    try {
      if (user?.id === 'guest') {
        setUser(null);
        setHistory([]);
      } else {
        await signOut(auth);
      }
      setCurrentView('scan');
      setShowLogin(false); // Reset to Home view
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'scan':
        return <ScanView 
                  onAnalysisComplete={handleAddFoodItem} 
                  language={language} 
                  t={t} 
                  userTier={user?.tier || 'guest'}
                  onNavigateToLogin={handleLogout} // Actually logs out guest to show login screen
                />;
      case 'history':
        return <HistoryView history={history} onSelectItem={handleSelectFoodItem} onDelete={handleRequestDelete} t={t} />;
      case 'detail':
        if (selectedFoodItem) {
          return <FoodDetailView item={selectedFoodItem} onDelete={handleRequestDelete} onRescan={handleRescanItem} isRescanning={isRescanning} t={t} />;
        }
        setCurrentView('history'); // Fallback if no item is selected
        return null;
      case 'pricing':
        return (
            <PricingView 
                t={t} 
                currentTier={user?.tier || 'guest'} 
                onUpgrade={handleUpgrade}
                onContactUs={() => alert("Contact support feature coming soon!")}
            />
        );
      default:
        return <ScanView 
                  onAnalysisComplete={handleAddFoodItem} 
                  language={language} 
                  t={t} 
                  userTier={user?.tier || 'guest'}
                  onNavigateToLogin={handleLogout}
                />;
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

  // Unauthenticated State: Show Home or Login
  if (!user) {
    if (showLogin) {
      return (
        <LoginView 
          t={t} 
          onLogin={handleGoogleLogin} 
          onEmailLogin={handleEmailLogin} 
          onEmailSignup={handleEmailSignup}
          onGuestLogin={handleGuestLogin}
          onBack={() => setShowLogin(false)}
          isLoggingIn={isLoggingIn} 
          error={loginError}
        />
      );
    }
    return <HomeView t={t} onGetStarted={() => setShowLogin(true)} />;
  }

  // Authenticated App
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Header 
        currentView={currentView} 
        onNavigate={handleNavigation} 
        language={language}
        setLanguage={handleLanguageChange}
        t={t}
        user={user}
        onLogin={handleGoogleLogin}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      
      <Footer t={t} />

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
        onConfirm={handleConfirmDelete}
        title={t.deleteButton}
        message={t.deleteConfirm}
        t={t}
      />
    </div>
  );
}

export default App;
