
import React from 'react';
import { View, Language, TranslationDictionary, User } from '../types';
import { ScanIcon, HistoryIcon, GoogleIcon } from './Icons';
import { LANGUAGES } from '../constants';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, language, setLanguage, t, user, onLogin, onLogout }) => {
  const navItemClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors text-sm md:text-base";
  const activeClasses = "bg-green-600 text-white shadow-sm";
  const inactiveClasses = "text-gray-600 hover:bg-gray-200";

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        
        <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('scan')}>
            <div className="bg-green-500 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
                {t.appTitle}
            </h1>
            </div>

            {/* Mobile Language Selector */}
            <div className="md:hidden">
                <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="bg-gray-100 border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2 outline-none"
                >
                    {LANGUAGES.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                             {lang.flag} {lang.code.toUpperCase()}
                        </option>
                    ))}
                </select>
            </div>
        </div>

        <div className="flex flex-wrap md:flex-nowrap items-center justify-between md:justify-end w-full md:w-auto gap-4">
            <nav className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg flex-grow md:flex-grow-0 order-1">
                <button
                    onClick={() => onNavigate('scan')}
                    className={`flex-1 md:flex-none justify-center ${navItemClasses} ${currentView === 'scan' ? activeClasses : inactiveClasses}`}
                >
                    <ScanIcon className="h-5 w-5" />
                    <span>{t.scanTab}</span>
                </button>
                <button
                    onClick={() => onNavigate('history')}
                    className={`flex-1 md:flex-none justify-center ${navItemClasses} ${currentView === 'history' ? activeClasses : inactiveClasses}`}
                >
                    <HistoryIcon className="h-5 w-5" />
                    <span>{t.historyTab}</span>
                </button>
            </nav>

            {/* Controls Container */}
            <div className="flex items-center gap-3 order-2">
                {/* Desktop Language Selector */}
                <div className="hidden md:block">
                    <select 
                        value={language} 
                        onChange={(e) => setLanguage(e.target.value as Language)}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 outline-none cursor-pointer hover:border-green-500 transition-colors"
                    >
                        {LANGUAGES.map((lang) => (
                            <option key={lang.code} value={lang.code}>
                                {lang.flag} {lang.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* User / Login Section */}
                {user ? (
                    <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
                        <div className="hidden lg:flex flex-col items-end">
                            <span className="text-xs text-gray-500 font-medium">{t.welcomeUser}</span>
                            <span className="text-sm font-semibold text-gray-800">{user.name}</span>
                        </div>
                        <div className="relative group">
                            <img 
                                src={user.picture} 
                                alt={user.name} 
                                className="w-9 h-9 rounded-full border-2 border-white shadow-sm cursor-pointer" 
                            />
                            {/* Dropdown Menu Wrapper with padding to bridge the gap */}
                            <div className="absolute right-0 top-full pt-2 w-48 z-20 hidden group-hover:block">
                                <div className="bg-white rounded-md shadow-lg py-1 border border-gray-100">
                                    <div className="px-4 py-2 border-b border-gray-100 lg:hidden">
                                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <button 
                                        onClick={onLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                                    >
                                        {t.logoutButton}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button 
                        onClick={onLogin}
                        className="flex items-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
                    >
                        <GoogleIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">{t.loginButton}</span>
                        <span className="sm:hidden">Sign in</span>
                    </button>
                )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
