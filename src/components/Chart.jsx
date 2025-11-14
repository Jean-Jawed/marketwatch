import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatPrice } from '../utils/helpers';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Chart = ({ data, symbols, showVolume = true, isComparison = false }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    // Limiter à 1000 points max
    const step = Math.ceil(data.length / 1000);
    return data.filter((_, index) => index % step === 0);
  }, [data]);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 flex items-center justify-center h-96">
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {formatPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-4">
      {/* Prix Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip content={<CustomTooltip />} />
          {isComparison && symbols.length > 1 && <Legend />}
          
          {isComparison ? (
            symbols.map((symbol, index) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={2}
                dot={false}
                name={symbol}
                animationDuration={1000}
              />
            ))
          ) : (
            <Line
              type="monotone"
              dataKey="close"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={false}
              name="Prix"
              animationDuration={1000}
            />
          )}
        </LineChart>
      </ResponsiveContainer>

      {/* Volume Chart */}
      {showVolume && !isComparison && chartData[0]?.volume !== undefined && (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="date" 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#6b7280"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1f2937', 
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
            />
            <Bar 
              dataKey="volume" 
              fill="#10B981" 
              name="Volume"
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Chart;
