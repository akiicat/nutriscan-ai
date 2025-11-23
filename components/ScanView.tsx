
import React, { useState } from 'react';
import { analyzeFoodImage, analyzeFoodText } from '../services/geminiService';
import { FoodItem, FoodAnalysis, Language, TranslationDictionary } from '../types';
import { UploadIcon, ExclamationCircleIcon } from './Icons';
import Spinner from './Spinner';

interface ScanViewProps {
  onAnalysisComplete: (item: FoodItem) => void;
  language: Language;
  t: TranslationDictionary;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = reader.result as string;
            // Remove the data URL prefix e.g. "data:image/jpeg;base64,"
            resolve(result.split(',')[1]);
        };
        reader.onerror = error => reject(error);
    });
};

// Placeholder SVG for text-based scans
const TEXT_SCAN_PLACEHOLDER = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgNjAwIDQwMCI+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2YwZmRmNCIgLz4KICA8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiMzNzQxNTEiPlRleHQgU2NhbiBSZXN1bHQ8L3RleHQ+Cjwvc3ZnPg==`;

const ScanView: React.FC<ScanViewProps> = ({ onAnalysisComplete, language, t }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setError(null);
      await processImage(file);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setError(null);
    setIsLoading(true);
    try {
        const analysisResult: FoodAnalysis = await analyzeFoodText(textInput, language);
        
        const newFoodItem: FoodItem = {
            id: new Date().toISOString(),
            image: TEXT_SCAN_PLACEHOLDER,
            analysis: analysisResult,
            location: "Manual Input",
            scanDate: new Date().toISOString(),
        };
        onAnalysisComplete(newFoodItem);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(t.unknownError);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const processImage = async (file: File) => {
    setIsLoading(true);
    try {
        const base64Image = await fileToBase64(file);
        const analysisResult: FoodAnalysis = await analyzeFoodImage(base64Image, language);
        
        const newFoodItem: FoodItem = {
            id: new Date().toISOString(),
            image: `data:image/jpeg;base64,${base64Image}`,
            analysis: analysisResult,
            location: "Your Location", // Placeholder
            scanDate: new Date().toISOString(),
        };
        onAnalysisComplete(newFoodItem);
    } catch (err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError(t.unknownError);
        }
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-2">{t.scanTitle}</h2>
        <p className="text-center text-gray-500 mb-6">{t.scanSubtitle}</p>
        
        {isLoading ? (
            <Spinner message={t.analyzing} />
        ) : (
            <>
                {/* Image Upload Section */}
                <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors duration-300 cursor-pointer mb-6">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    id="file-upload"
                    />
                    <label htmlFor="file-upload" className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
                        <UploadIcon className="h-12 w-12 text-gray-400" />
                        <span className="font-semibold text-green-600">{t.uploadClick}</span>
                        <span className="text-gray-500 text-sm">{t.uploadDrag}</span>
                    </label>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-grow h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-sm font-medium uppercase">{t.orDivider}</span>
                    <div className="flex-grow h-px bg-gray-200"></div>
                </div>

                {/* Text Input Section */}
                <div className="mb-2">
                    <label htmlFor="text-input" className="block text-sm font-medium text-gray-700 mb-2">
                        {t.textInputLabel}
                    </label>
                    <textarea
                        id="text-input"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none resize-none"
                        placeholder={t.textInputPlaceholder}
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                    ></textarea>
                </div>
                <button 
                    onClick={handleTextSubmit}
                    disabled={!textInput.trim()}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                        textInput.trim() 
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {t.analyzeTextButton}
                </button>

                {error && (
                    <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
                        <ExclamationCircleIcon className="h-6 w-6 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold">{t.analysisFailed}</p>
                            <p className="text-sm">{error}</p>
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default ScanView;