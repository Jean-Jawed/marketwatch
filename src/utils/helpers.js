export const formatPrice = (price, decimals = 2) => {
  if (price === null || price === undefined) return 'N/A';
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(price);
};

export const formatPercent = (value) => {
  if (value === null || value === undefined) return 'N/A';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatVolume = (volume) => {
  if (!volume) return 'N/A';
  if (volume >= 1e9) return `${(volume / 1e9).toFixed(2)}B`;
  if (volume >= 1e6) return `${(volume / 1e6).toFixed(2)}M`;
  if (volume >= 1e3) return `${(volume / 1e3).toFixed(2)}K`;
  return volume.toString();
};

export const formatMarketCap = (marketCap) => {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return `${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `${(marketCap / 1e6).toFixed(2)}M`;
  return formatPrice(marketCap, 0);
};

export const getTimeframeConfig = (timeframe) => {
  const configs = {
    '6h': { range: '1d', interval: '5m', label: '6 heures' },
    '1d': { range: '1d', interval: '15m', label: '1 jour' },
    '1w': { range: '5d', interval: '1h', label: '1 semaine' },
    '1m': { range: '1mo', interval: '1d', label: '1 mois' },
    '1y': { range: '1y', interval: '1d', label: '1 an' },
    '5y': { range: '5y', interval: '1wk', label: '5 ans' },
  };
  return configs[timeframe] || configs['1m'];
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
