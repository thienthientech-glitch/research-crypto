
import React from 'react';
import { AnalyticsIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700/50 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-center">
        <AnalyticsIcon className="w-8 h-8 mr-3 text-cyan-400" />
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Crypto Project <span className="text-cyan-400">Analyzer</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;
