const API_BASE = import.meta.env.PROD ? '' : '';

export const searchAssets = async (query) => {
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  if (!response.ok) throw new Error('Erreur de recherche');
  return response.json();
};

export const getTickerData = async (symbol, range = '1mo', interval = '1d') => {
  const response = await fetch(
    `/api/ticker?symbol=${encodeURIComponent(symbol)}&range=${range}&interval=${interval}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur de récupération des données');
  }
  return response.json();
};

export const compareAssets = async (symbols, range = '1mo') => {
  const symbolsParam = symbols.join(',');
  const response = await fetch(
    `/api/compare?symbols=${encodeURIComponent(symbolsParam)}&range=${range}`
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erreur de comparaison');
  }
  return response.json();
};
