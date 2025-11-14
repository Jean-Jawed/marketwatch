import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="MarketWatch" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              MarketWatch
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </h1>
            <p className="text-sm text-gray-400">Visualisation de marchés financiers</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
