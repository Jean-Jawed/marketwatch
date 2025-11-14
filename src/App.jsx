import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchBar from './components/SearchBar';
import TimeframeSelector from './components/TimeframeSelector';
import LayoutSelector from './components/LayoutSelector';
import Chart from './components/Chart';
import MetricsCard from './components/MetricsCard';
import LoadingSkeleton from './components/LoadingSkeleton';
import { getTickerData, compareAssets } from './services/api';
import { getTimeframeConfig } from './utils/helpers';
import { RefreshCw, X } from 'lucide-react';

function App() {
  const [timeframe, setTimeframe] = useState('1m');
  const [layoutMode, setLayoutMode] = useState('separate'); // 'separate' ou 'overlay'
  const [gridSize, setGridSize] = useState(1);
  const [selectedAssets, setSelectedAssets] = useState([]);
  const [chartsData, setChartsData] = useState({});
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});

  const handleSelectAsset = (asset) => {
    if (layoutMode === 'overlay') {
      // Mode comparaison: ajouter l'asset si pas déjà présent
      if (!selectedAssets.find(a => a.symbol === asset.symbol)) {
        setSelectedAssets([...selectedAssets, asset]);
      }
    } else {
      // Mode séparé: remplacer ou ajouter selon gridSize
      if (selectedAssets.length < gridSize) {
        setSelectedAssets([...selectedAssets, asset]);
      } else {
        // Remplacer le dernier
        const newAssets = [...selectedAssets];
        newAssets[gridSize - 1] = asset;
        setSelectedAssets(newAssets);
      }
    }
  };

  const removeAsset = (symbol) => {
    setSelectedAssets(selectedAssets.filter(a => a.symbol !== symbol));
    const newData = { ...chartsData };
    delete newData[symbol];
    setChartsData(newData);
  };

  const fetchData = async (symbol) => {
    const config = getTimeframeConfig(timeframe);
    setLoading(prev => ({ ...prev, [symbol]: true }));
    setError(prev => ({ ...prev, [symbol]: null }));

    try {
      const data = await getTickerData(symbol, config.range, config.interval);
      setChartsData(prev => ({ ...prev, [symbol]: data }));
    } catch (err) {
      setError(prev => ({ ...prev, [symbol]: err.message }));
    } finally {
      setLoading(prev => ({ ...prev, [symbol]: false }));
    }
  };

  const fetchComparisonData = async () => {
    if (selectedAssets.length === 0) return;
    
    const symbols = selectedAssets.map(a => a.symbol);
    const config = getTimeframeConfig(timeframe);
    setLoading({ comparison: true });
    setError({ comparison: null });

    try {
      const data = await compareAssets(symbols, config.range);
      setChartsData({ comparison: data });
    } catch (err) {
      setError({ comparison: err.message });
    } finally {
      setLoading({ comparison: false });
    }
  };

  const refreshData = () => {
    if (layoutMode === 'overlay') {
      fetchComparisonData();
    } else {
      selectedAssets.forEach(asset => fetchData(asset.symbol));
    }
  };

  useEffect(() => {
    if (layoutMode === 'overlay' && selectedAssets.length > 0) {
      fetchComparisonData();
    } else if (layoutMode === 'separate') {
      selectedAssets.forEach(asset => fetchData(asset.symbol));
    }
  }, [selectedAssets, timeframe, layoutMode]);

  const getGridClass = () => {
    if (gridSize === 1) return 'grid-cols-1';
    if (gridSize === 2) return 'grid-cols-1 lg:grid-cols-2';
    if (gridSize === 3) return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3';
    return 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-2';
  };

  return (
    <div className="min-h-screen flex flex-col bg-concrete">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        {/* Barre de recherche */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <SearchBar onSelectAsset={handleSelectAsset} />
        </div>

        {/* Contrôles */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <TimeframeSelector selected={timeframe} onSelect={setTimeframe} />
            <LayoutSelector
              mode={layoutMode}
              gridSize={gridSize}
              onModeChange={setLayoutMode}
              onGridSizeChange={setGridSize}
            />
            <button
              onClick={refreshData}
              disabled={selectedAssets.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </button>
          </div>

          {/* Liste des assets sélectionnés */}
          {selectedAssets.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-600 mr-2">Assets sélectionnés:</span>
              {selectedAssets.map(asset => (
                <div
                  key={asset.symbol}
                  className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="text-sm font-medium">{asset.symbol}</span>
                  <button
                    onClick={() => removeAsset(asset.symbol)}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Zone graphiques */}
        {selectedAssets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-200 text-center">
            <p className="text-gray-500 text-lg">
              Recherchez un asset pour commencer
            </p>
          </div>
        ) : layoutMode === 'overlay' ? (
          // Mode comparaison overlay
          <div className="space-y-6">
            {loading.comparison ? (
              <LoadingSkeleton />
            ) : error.comparison ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                {error.comparison}
              </div>
            ) : chartsData.comparison ? (
              <Chart
                data={chartsData.comparison.data}
                symbols={selectedAssets.map(a => a.symbol)}
                isComparison={true}
                showVolume={false}
              />
            ) : null}
          </div>
        ) : (
          // Mode séparé
          <div className={`grid ${getGridClass()} gap-6`}>
            {selectedAssets.slice(0, gridSize).map(asset => (
              <div key={asset.symbol} className="space-y-4">
                {loading[asset.symbol] ? (
                  <LoadingSkeleton />
                ) : error[asset.symbol] ? (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
                    <p className="font-semibold mb-2">{asset.name}</p>
                    <p>{error[asset.symbol]}</p>
                  </div>
                ) : chartsData[asset.symbol] ? (
                  <>
                    <MetricsCard data={chartsData[asset.symbol].info} />
                    <Chart
                      data={chartsData[asset.symbol].history}
                      symbols={[asset.symbol]}
                      showVolume={true}
                    />
                  </>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
