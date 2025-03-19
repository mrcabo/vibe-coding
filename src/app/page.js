"use client";

import { useState, useEffect } from 'react';
import AddStockForm from '../components/AddStockForm';
import PortfolioList from '../components/PortfolioList';
import PortfolioTreemap from '../components/PortfolioTreemap';
import PortfolioTreemapSimplified from '../components/PortfolioTreemapSimplified';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { loadPortfolio, savePortfolio } from '../lib/portfolioUtils';
import { fetchStockData } from '../lib/stockApi';

export default function Home() {
  const [portfolio, setPortfolio] = useState([]);
  const [stockData, setStockData] = useState({});
  const [timeRange, setTimeRange] = useState('1m'); // Default to 1 month
  const [isLoading, setIsLoading] = useState(true);
  const [showAddStock, setShowAddStock] = useState(false);

  const toggleAddStock = () => {
    setShowAddStock(!showAddStock);
  };

  // Load portfolio data on component mount
  useEffect(() => {
    // Add a short delay to ensure components are properly mounted
    const timer = setTimeout(() => {
      const portfolioData = loadPortfolio();
      console.log("Loaded portfolio data:", portfolioData);
      setPortfolio(portfolioData);
      if (portfolioData && portfolioData.length > 0) {
        updateStockData(portfolioData, timeRange);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Update stock data when portfolio or time range changes
  useEffect(() => {
    if (portfolio.length > 0) {
      updateStockData(portfolio, timeRange);
    }
  }, [portfolio, timeRange]);

  const updateStockData = async (portfolioData, range) => {
    setIsLoading(true);
    
    try {
      // Make sure we have valid portfolio data
      if (!portfolioData || !Array.isArray(portfolioData) || portfolioData.length === 0) {
        setStockData({});
        return;
      }
      
      // Filter out any items without symbols
      const validStocks = portfolioData.filter(item => item && item.symbol);
      const symbols = validStocks.map(item => item.symbol);
      
      if (symbols.length > 0) {
        const data = await fetchStockData(symbols, range);
        
        // Validate the returned data
        if (data && typeof data === 'object') {
          setStockData(data);
        } else {
          console.error('Invalid data returned from fetchStockData');
          setStockData({});
        }
      } else {
        setStockData({});
      }
    } catch (error) {
      console.error('Failed to fetch stock data:', error);
      setStockData({});
    } finally {
      setIsLoading(false);
    }
  };

  const addStock = (newStock) => {
    // Check if stock already exists in portfolio
    const existingIndex = portfolio.findIndex(
      item => item.symbol.toLowerCase() === newStock.symbol.toLowerCase()
    );

    let updatedPortfolio;
    if (existingIndex >= 0) {
      // Update existing stock
      updatedPortfolio = portfolio.map((item, index) => 
        index === existingIndex 
          ? { ...item, investment: item.investment + newStock.investment }
          : item
      );
    } else {
      // Add new stock
      updatedPortfolio = [...portfolio, newStock];
    }
    
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  };

  const removeStock = (symbol) => {
    const updatedPortfolio = portfolio.filter(item => item.symbol !== symbol);
    setPortfolio(updatedPortfolio);
    savePortfolio(updatedPortfolio);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Portfolio Visualization</h2>
            <div className="flex items-center gap-4">
              <TimeRangeSelector 
                selectedRange={timeRange} 
                onChange={handleTimeRangeChange} 
              />
              <button 
                onClick={toggleAddStock}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
              >
                {showAddStock ? 'Hide Form' : 'Add Stock'}
              </button>
            </div>
          </div>
          
          {/* Show Add Stock form only when button is clicked */}
          {showAddStock && (
            <div className="mb-6 p-4 border rounded bg-gray-50">
              <h2 className="text-lg font-semibold mb-3">Add New Stock</h2>
              <AddStockForm onAddStock={addStock} />
            </div>
          )}
          
          {/* Larger treemap visualization */}
          <PortfolioTreemapSimplified 
            portfolio={portfolio} 
            stockData={stockData}
            isLoading={isLoading}
          />
          
          {/* Keep the original treemap as fallback but don't display it */}
          <div style={{ display: 'none' }}>
            <PortfolioTreemap 
              portfolio={portfolio} 
              stockData={stockData}
              isLoading={isLoading}
            />
          </div>
        </div>
        
        {/* Portfolio list below the visualization */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Portfolio</h2>
          <PortfolioList 
            portfolio={portfolio} 
            stockData={stockData} 
            onRemove={removeStock} 
          />
        </div>
      </div>
    </div>
  );
}