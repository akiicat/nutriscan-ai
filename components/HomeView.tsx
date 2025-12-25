
import React from 'react';
import { TranslationDictionary } from '../types';
import { ScanIcon, CheckCircleIcon, HistoryIcon } from './Icons';

interface HomeViewProps {
  t: TranslationDictionary;
  onGetStarted: () => void;
}

const FeatureCard: React.FC<{ title: string; desc: string; icon: React.ReactNode }> = ({ title, desc, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center text-green-600 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600">{desc}</p>
  </div>
);

const HomeView: React.FC<HomeViewProps> = ({ t, onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      {/* Navbar Placeholder - simplistic for landing */}
      <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="bg-green-500 p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <span className="text-xl font-bold text-gray-800 tracking-tight">{t.appTitle}</span>
            </div>
            <button 
                onClick={onGetStarted}
                className="text-gray-600 hover:text-green-600 font-medium transition-colors"
            >
                {t.signInAction}
            </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28">
         {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
                {t.homeHeroTitle}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
                {t.homeHeroSubtitle}
            </p>
            <button
                onClick={onGetStarted}
                className="bg-green-600 hover:bg-green-700 text-white text-lg font-semibold px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 ring-4 ring-green-100"
            >
                {t.homeGetStarted}
            </button>
            
            <div className="mt-12 flex justify-center">
                <img 
                    src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Healthy Food" 
                    className="rounded-2xl shadow-2xl border-4 border-white max-w-full w-[600px] h-auto object-cover"
                />
            </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
                <FeatureCard 
                    title={t.feature1Title} 
                    desc={t.feature1Desc} 
                    icon={<ScanIcon className="h-6 w-6" />}
                />
                <FeatureCard 
                    title={t.feature2Title} 
                    desc={t.feature2Desc} 
                    icon={<CheckCircleIcon className="h-6 w-6" />}
                />
                <FeatureCard 
                    title={t.feature3Title} 
                    desc={t.feature3Desc} 
                    icon={<HistoryIcon className="h-6 w-6" />}
                />
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="container mx-auto px-6 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} {t.footer}</p>
        </div>
      </footer>
    </div>
  );
};

export default HomeView;
