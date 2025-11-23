import React from 'react';
import { TranslationDictionary } from '../types';
import { GoogleIcon } from './Icons';

interface LoginViewProps {
  t: TranslationDictionary;
  onLogin: () => void;
  isLoggingIn: boolean;
}

const LoginView: React.FC<LoginViewProps> = ({ t, onLogin, isLoggingIn }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-32 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl w-full max-w-md text-center relative z-10 border border-gray-100">
        <div className="w-20 h-20 bg-green-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-3">{t.appTitle}</h1>
        <p className="text-gray-600 mb-8">
          Sign in to start scanning food, analyzing ingredients, and tracking your nutrition history.
        </p>

        <button
          onClick={onLogin}
          disabled={isLoggingIn}
          className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 px-6 py-3.5 rounded-xl font-medium transition-all shadow-sm transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? (
            <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <GoogleIcon className="w-6 h-6" />
          )}
          <span className="text-base">{t.loginButton}</span>
        </button>

        <p className="mt-6 text-xs text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default LoginView;