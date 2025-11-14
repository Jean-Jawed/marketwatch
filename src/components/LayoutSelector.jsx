import React from 'react';
import { Grid2x2, Grid3x3, LayoutGrid, Layers } from 'lucide-react';

const LayoutSelector = ({ mode, gridSize, onModeChange, onGridSizeChange }) => {
  return (
    <div className="flex gap-4 items-center flex-wrap">
      <div className="flex gap-2 bg-white rounded-lg p-1 border border-gray-300">
        <button
          onClick={() => onModeChange('separate')}
          className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
            mode === 'separate'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
          Séparés
        </button>
        <button
          onClick={() => onModeChange('overlay')}
          className={`px-4 py-2 rounded-md font-medium transition-all flex items-center gap-2 ${
            mode === 'overlay'
              ? 'bg-gray-900 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          Comparaison
        </button>
      </div>

      {mode === 'separate' && (
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((size) => (
            <button
              key={size}
              onClick={() => onGridSizeChange(size)}
              className={`p-2 rounded-md transition-all ${
                gridSize === size
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
              title={`${size} graphique${size > 1 ? 's' : ''}`}
            >
              {size === 1 && <Grid2x2 className="w-5 h-5" />}
              {size === 2 && <Grid2x2 className="w-5 h-5" />}
              {size === 3 && <Grid3x3 className="w-5 h-5" />}
              {size === 4 && <LayoutGrid className="w-5 h-5" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LayoutSelector;
