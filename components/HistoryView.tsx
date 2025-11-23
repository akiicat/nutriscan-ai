
import React from 'react';
import { FoodItem, TranslationDictionary } from '../types';

interface HistoryViewProps {
  history: FoodItem[];
  onSelectItem: (item: FoodItem) => void;
  t: TranslationDictionary;
}

const FoodItemCard: React.FC<{ item: FoodItem; onClick: () => void }> = ({ item, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col"
  >
    <img className="h-48 w-full object-cover" src={item.image} alt={item.analysis.productName} />
    <div className="p-4 flex-grow flex flex-col">
      <h3 className="font-bold text-lg text-gray-800 truncate">{item.analysis.productName}</h3>
      <p className="text-gray-500 text-sm mb-3">{new Date(item.scanDate).toLocaleDateString()}</p>
      <p className="text-gray-600 text-sm flex-grow line-clamp-2">{item.analysis.summary}</p>
    </div>
  </div>
);

const HistoryView: React.FC<HistoryViewProps> = ({ history, onSelectItem, t }) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{t.historyTitle}</h2>
      {history.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500">{t.historyEmpty}</p>
          <p className="text-gray-500">{t.historyEmptyAction}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {history.map(item => (
            <FoodItemCard key={item.id} item={item} onClick={() => onSelectItem(item)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryView;
