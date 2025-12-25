
import React, { useState } from 'react';
import { FoodItem, HealthRating, Ingredient, TranslationDictionary } from '../types';
import { CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon, TrashIcon, ShareIcon, RefreshIcon } from './Icons';
import ShareModal from './ShareModal';

const ratingStyles: { [key in HealthRating]: { icon: React.ReactNode; bg: string; text: string; ring: string } } = {
  GOOD: { icon: <CheckCircleIcon className="h-5 w-5" />, bg: 'bg-green-100', text: 'text-green-800', ring: 'ring-green-200' },
  MODERATE: { icon: <InformationCircleIcon className="h-5 w-5" />, bg: 'bg-yellow-100', text: 'text-yellow-800', ring: 'ring-yellow-200' },
  POOR: { icon: <ExclamationCircleIcon className="h-5 w-5" />, bg: 'bg-red-100', text: 'text-red-800', ring: 'ring-red-200' },
  NEUTRAL: { icon: <InformationCircleIcon className="h-5 w-5" />, bg: 'bg-gray-100', text: 'text-gray-800', ring: 'ring-gray-200' },
};

const IngredientRow: React.FC<{ ingredient: Ingredient }> = ({ ingredient }) => {
  const styles = ratingStyles[ingredient.rating] || ratingStyles.NEUTRAL;
  return (
    <li className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 rounded-lg transition-colors hover:bg-gray-50">
      <div className={`flex items-center gap-2 font-semibold ${styles.text} w-full sm:w-1/3`}>
        <div className={`${styles.bg} p-1 rounded-full`}>{styles.icon}</div>
        <span>{ingredient.name}</span>
      </div>
      <p className="text-gray-600 text-sm sm:w-2/3">{ingredient.reason}</p>
    </li>
  );
};

interface FoodDetailViewProps {
  item: FoodItem; 
  onDelete: (itemId: string) => void; 
  onRescan: (item: FoodItem) => void;
  isRescanning: boolean;
  t: TranslationDictionary;
}

const FoodDetailView: React.FC<FoodDetailViewProps> = ({ item, onDelete, onRescan, isRescanning, t }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  return (
    <>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <div className="md:flex">
          <div 
            className="md:flex-shrink-0 cursor-pointer relative group"
            onClick={() => setIsModalOpen(true)}
          >
            <img 
                className="h-64 w-full object-cover md:w-64 transition-opacity group-hover:opacity-90" 
                src={item.image} 
                alt={item.analysis.productName} 
            />
             <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white drop-shadow-lg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
             </div>
          </div>
          <div className="p-8 flex flex-col justify-center flex-grow relative">
            {/* Action Buttons in Top Right */}
            <div className="absolute top-4 right-4 md:top-8 md:right-8 flex items-center gap-2">
              <button 
                  onClick={() => onRescan(item)}
                  disabled={isRescanning}
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  <RefreshIcon className={`h-4 w-4 ${isRescanning ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{isRescanning ? t.analyzing : t.rescanButton}</span>
              </button>
              <button 
                  onClick={() => setIsShareModalOpen(true)}
                  disabled={isRescanning}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                  <ShareIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.shareButton}</span>
              </button>
              <button 
                  onClick={() => onDelete(item.id)}
                  disabled={isRescanning}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
              >
                  <TrashIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.deleteButton}</span>
              </button>
            </div>

            <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">
              {new Date(item.scanDate).toLocaleDateString()}
            </div>
            <h1 className="block mt-1 text-3xl leading-tight font-bold text-black pr-32">{item.analysis.productName}</h1>
            <div className="mt-2 flex items-center gap-4 text-gray-500">
              <span>{t.detailPrice}: <span className="font-semibold text-gray-700">{item.analysis.price}</span></span>
            </div>
          </div>
        </div>
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-3">{t.detailSummary}</h2>
          <p className="text-gray-700 leading-relaxed">{item.analysis.summary}</p>
        </div>
        <div className="p-8 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">{t.detailIngredients}</h2>
          <ul className="space-y-2 divide-y divide-gray-200">
            {item.analysis.ingredients.map((ing, index) => (
              <IngredientRow key={index} ingredient={ing} />
            ))}
          </ul>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 cursor-pointer"
            onClick={() => setIsModalOpen(false)}
        >
            <div className="relative max-w-5xl max-h-full w-full flex items-center justify-center">
                 <img 
                    src={item.image} 
                    alt={item.analysis.productName} 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                 />
                 <button 
                    className="absolute -top-12 right-0 text-white hover:text-gray-300 focus:outline-none bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
                    onClick={(e) => { e.stopPropagation(); setIsModalOpen(false); }}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                 </button>
            </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        item={item}
        t={t}
      />
    </>
  );
};

export default FoodDetailView;
