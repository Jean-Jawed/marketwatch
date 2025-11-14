import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { ASSETS } from '../data/assets';
import { debounce } from '../utils/helpers';

const SearchBar = ({ onSelectAsset }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchAssets = debounce((searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = ASSETS.filter(asset => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);

    setResults(filtered);
    setIsOpen(true);
  }, 300);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    searchAssets(value);
  };

  const handleSelectAsset = (asset) => {
    onSelectAsset(asset);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getTypeLabel = (type) => {
    const labels = {
      stock: 'Action',
      crypto: 'Crypto',
      commodity: 'Matière première',
      forex: 'Forex',
      index: 'Indice'
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      stock: 'bg-blue-500',
      crypto: 'bg-purple-500',
      commodity: 'bg-amber-500',
      forex: 'bg-green-500',
      index: 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher une action, crypto, matière première..."
          className="w-full pl-12 pr-12 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors text-gray-900"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setResults([]);
              setIsOpen(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {results.map((asset) => (
            <button
              key={asset.symbol}
              onClick={() => handleSelectAsset(asset)}
              className="w-full px-4 py-3 hover:bg-gray-50 flex items-center justify-between transition-colors border-b border-gray-100 last:border-0 text-left"
            >
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{asset.name}</div>
                <div className="text-sm text-gray-500">{asset.symbol}</div>
              </div>
              <span className={`${getTypeBadgeColor(asset.type)} text-white text-xs px-2 py-1 rounded-full`}>
                {getTypeLabel(asset.type)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
