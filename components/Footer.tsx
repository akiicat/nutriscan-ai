
import React from 'react';
import { TranslationDictionary } from '../types';

interface FooterProps {
  t: TranslationDictionary;
}

const Footer: React.FC<FooterProps> = ({ t }) => {
  return (
    <footer className="bg-white mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} {t.footer}</p>
      </div>
    </footer>
  );
};

export default Footer;
