import React from 'react';

const TIMEFRAMES = [
  { id: '6h', label: '6H' },
  { id: '1d', label: '1J' },
  { id: '1w', label: '1S' },
  { id: '1m', label: '1M' },
  { id: '1y', label: '1A' },
  { id: '5y', label: '5A' },
];

const TimeframeSelector = ({ selected, onSelect }) => {
  return (
    <div className="flex gap-2 flex-wrap">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.id}
          onClick={() => onSelect(tf.id)}
          className={`px-4 py-2 rounded-full font-medium transition-all ${
            selected === tf.id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  );
};

export default TimeframeSelector;
