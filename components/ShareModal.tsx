
import React, { useState } from 'react';
import { TranslationDictionary, FoodItem } from '../types';
import { CopyIcon, FacebookIcon, TwitterIcon, WhatsAppIcon, LinkIcon } from './Icons';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FoodItem;
  t: TranslationDictionary;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, item, t }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // In a real production app with routing, this would be a specific URL like /food/:id
  // For this preview/SPA, we'll just use the current page URL
  const shareUrl = window.location.href;
  const shareText = `Check out this nutritional analysis for ${item.analysis.productName} on NutriScan AI!`;

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full transform transition-all scale-100 border border-gray-100 overflow-hidden" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">{t.shareModalTitle}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">{t.shareVia}</p>
            <div className="flex justify-around gap-2">
              <a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FacebookIcon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">Facebook</span>
              </a>
              
              <a 
                href={socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <TwitterIcon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">Twitter</span>
              </a>

              <a 
                href={socialLinks.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 group"
              >
                <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <WhatsAppIcon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600">WhatsApp</span>
              </a>
            </div>
          </div>

          <div className="relative">
            <p className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">{t.copyLink}</p>
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-2">
              <div className="bg-white p-1.5 rounded-md border border-gray-100 shadow-sm text-gray-400">
                <LinkIcon className="w-4 h-4" />
              </div>
              <input 
                type="text" 
                readOnly 
                value={shareUrl} 
                className="bg-transparent border-none text-sm text-gray-600 flex-grow focus:ring-0 w-full truncate"
              />
              <button 
                onClick={handleCopyLink}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {t.copied}
                  </>
                ) : (
                  <>
                    <CopyIcon className="w-4 h-4" />
                    {t.copyLink}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
