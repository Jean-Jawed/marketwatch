import React from 'react';
import { formatPrice, formatPercent, formatVolume, formatMarketCap } from '../utils/helpers';
import { TrendingUp, TrendingDown } from 'lucide-react';

const MetricsCard = ({ data }) => {
  if (!data) return null;

  const metrics = [
    { label: 'Prix actuel', value: formatPrice(data.currentPrice), key: 'price' },
    { 
      label: 'Variation jour', 
      value: formatPercent(data.changePercent),
      isChange: true,
      positive: data.changePercent >= 0
    },
    { label: 'High 52S', value: formatPrice(data.fiftyTwoWeekHigh) },
    { label: 'Low 52S', value: formatPrice(data.fiftyTwoWeekLow) },
    { label: 'Volume moy.', value: formatVolume(data.averageVolume) },
    { label: 'Market Cap', value: formatMarketCap(data.marketCap) },
    { label: 'P/E Ratio', value: data.peRatio ? data.peRatio.toFixed(2) : 'N/A' },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{data.name}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="animate-countup">
            <div className="text-sm text-gray-500 mb-1">{metric.label}</div>
            <div className={`text-lg font-bold flex items-center gap-1 ${
              metric.isChange
                ? metric.positive
                  ? 'text-emerald-600'
                  : 'text-red-600'
                : 'text-gray-900'
            }`}>
              {metric.isChange && (
                metric.positive 
                  ? <TrendingUp className="w-4 h-4" />
                  : <TrendingDown className="w-4 h-4" />
              )}
              {metric.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MetricsCard;
