
import React from 'react';

interface SpinnerProps {
  message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message = "Analyzing..." }) => (
  <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-lg font-semibold text-gray-700">{message}</p>
    <p className="text-sm text-gray-500 max-w-sm">Our AI is examining the ingredients and nutritional information. This might take a moment.</p>
  </div>
);

export default Spinner;
