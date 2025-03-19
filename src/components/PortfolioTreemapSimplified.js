import React from 'react';
import { calculateStockValue, calculatePercentChange } from '../lib/portfolioUtils';

const PortfolioTreemapSimplified = ({ portfolio, stockData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 border rounded bg-gray-50">
        <p>Loading stock data...</p>
      </div>
    );
  }

  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border rounded bg-gray-50">
        <p>Add stocks to your portfolio to see the visualization.</p>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalValue = portfolio.reduce((total, stock) => {
    return total + calculateStockValue(stock, stockData);
  }, 0);

  // Prepare data for the simplified treemap
  const stockBlocks = portfolio.map((stock) => {
    const currentValue = calculateStockValue(stock, stockData);
    const percentChange = calculatePercentChange(stock, stockData);
    const percentOfPortfolio = (currentValue / totalValue) * 100;
    const sharesText = `${stock.shares} ${stock.shares === 1 ? 'share' : 'shares'}`;
    
    // Determine color based on percent change
    const getBlockColor = () => {
      const isPositive = percentChange >= 0;
      const absChange = Math.abs(percentChange);
      const intensity = Math.min(absChange / 10, 1); // Cap at 10% for full color
      
      if (isPositive) {
        // Green for positive returns
        return `rgba(0, ${Math.floor(128 + 127 * intensity)}, 0, 0.9)`;
      } else {
        // Red for negative returns
        return `rgba(${Math.floor(128 + 127 * intensity)}, 0, 0, 0.9)`;
      }
    };
    
    const textColor = Math.abs(percentChange) > 3 ? 'white' : 'black';
    
    return {
      symbol: stock.symbol,
      companyName: stock.companyName,
      shares: stock.shares,
      sharesText,
      currentValue,
      percentChange,
      percentOfPortfolio,
      backgroundColor: getBlockColor(),
      textColor
    };
  });
  
  // Sort blocks by size (largest first)
  stockBlocks.sort((a, b) => b.currentValue - a.currentValue);
  
  return (
    <div className="border rounded bg-white p-4" style={{ minHeight: '500px' }}>
      <div className="flex flex-wrap gap-3" style={{ minHeight: '460px' }}>
        {stockBlocks.map((block) => {
          // Calculate size based on portfolio percentage (with min and max sizes)
          const width = Math.max(30, Math.min(100, (block.percentOfPortfolio * 3)));
          const height = Math.max(160, Math.min(240, 160 + (block.percentOfPortfolio * 2)));
          
          return (
            <div 
              key={block.symbol}
              className="p-4 rounded flex flex-col justify-between shadow-sm"
              style={{ 
                backgroundColor: block.backgroundColor,
                color: block.textColor,
                width: `${width}%`,
                height: `${height}px`,
                margin: '0.35rem',
                flexGrow: 1,
                minWidth: '180px'
              }}
            >
              <div>
                <h3 className="font-bold text-xl">{block.symbol}</h3>
                <p className="text-sm opacity-90">{block.companyName}</p>
              </div>
              <div>
                <p className="font-semibold text-lg">${block.currentValue.toFixed(2)}</p>
                <p className="text-sm font-medium">
                  {block.percentChange >= 0 ? '+' : ''}{block.percentChange.toFixed(2)}%
                </p>
                <p className="text-xs mt-1">{block.sharesText}</p>
                <p className="text-xs">{block.percentOfPortfolio.toFixed(1)}% of portfolio</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioTreemapSimplified;