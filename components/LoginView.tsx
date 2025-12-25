
import React, { useState } from 'react';
import { TranslationDictionary } from '../types';
import { GoogleIcon } from './Icons';

interface LoginViewProps {
  t: TranslationDictionary;
  onLogin: () => void;
  onEmailLogin: (email: string, pass: string) => void;
  onEmailSignup: (email: string, pass: string) => void;
  onGuestLogin: () => void;
  onBack: () => void;
  isLoggingIn: boolean;
  error: string | null;
}

const LoginView: React.FC<LoginViewProps> = ({ 
  t, 
  onLogin, 
  onEmailLogin, 
  onEmailSignup, 
  onGuestLogin, 
  onBack,
  isLoggingIn, 
  error 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // Check if we are in development mode
  // Using process.env.NODE_ENV is safer across different build tools (Vite/CRA)
  const isDevelopment = process.env.NODE_ENV === 'development';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    if (isSignUpMode) {
      onEmailSignup(email, password);
    } else {
      onEmailLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-gray-600 hover:text-green-600 font-medium transition-colors bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:bg-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        <span className="hidden sm:inline">{t.backToHome}</span>
      </button>

      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md text-center relative z-10 border border-gray-100">
        <div className="w-16 h-16 bg-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.appTitle}</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Sign in to analyze ingredients and track nutrition.
        </p>

        {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm border border-red-200 text-left">
                {error}
            </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.emailLabel}</label>
            <input 
              type="email" 
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.passwordLabel}</label>
            <input 
              type="password" 
              required
              placeholder={t.passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
             {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
             ) : (
                isSignUpMode ? t.signUpAction : t.signInAction
             )}
          </button>
        </form>

        <div className="text-sm text-center mb-6">
          <button 
            type="button"
            onClick={() => setIsSignUpMode(!isSignUpMode)}
            className="text-green-600 hover:text-green-700 font-medium hover:underline"
          >
            {isSignUpMode ? t.switchToSignIn : t.switchToString}
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">{t.orDivider}</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <button
            onClick={onLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <GoogleIcon className="w-5 h-5" />
            <span>{t.loginButton}</span>
          </button>
          
          {isDevelopment && (
            <button
                onClick={onGuestLogin}
                className="w-full text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
                {t.guestLoginButton} (Dev Only)
            </button>
          )}
        </div>

        <p className="mt-8 text-xs text-gray-400">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
};

export default LoginView;
