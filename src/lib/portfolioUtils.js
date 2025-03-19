/**
 * Load portfolio data from local storage or default JSON file
 */
export const loadPortfolio = () => {
  // Check if window is defined (client-side)
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    // Try to load from localStorage first
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      return JSON.parse(savedPortfolio);
    }
    
    // Default empty portfolio
    return [];
  } catch (error) {
    console.error('Failed to load portfolio:', error);
    return [];
  }
};

/**
 * Save portfolio data to local storage
 */
export const savePortfolio = (portfolioData) => {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    localStorage.setItem('portfolio', JSON.stringify(portfolioData));
  } catch (error) {
    console.error('Failed to save portfolio:', error);
  }
};

/**
 * Calculate the total value of the portfolio
 */
export const calculateTotalValue = (portfolio, stockData) => {
  return portfolio.reduce((total, stock) => {
    // If we have current price data for this stock
    if (stockData[stock.symbol] && stockData[stock.symbol].currentPrice) {
      const shares = stock.investment / stock.purchasePrice;
      const currentValue = shares * stockData[stock.symbol].currentPrice;
      return total + currentValue;
    }
    // Otherwise, use the investment amount
    return total + stock.investment;
  }, 0);
};

/**
 * Calculate the current value of a stock
 */
export const calculateStockValue = (stock, stockData) => {
  // Check if all required data exists
  if (!stock || !stock.symbol || !stock.shares) {
    return 0;
  }
  
  // Check if we have current price data
  if (stockData && 
      stockData[stock.symbol] && 
      stockData[stock.symbol].currentPrice && 
      !isNaN(stockData[stock.symbol].currentPrice)) {
    return stock.shares * stockData[stock.symbol].currentPrice;
  }
  
  // Return initial investment as fallback
  return stock.investment || (stock.shares * stock.purchasePrice) || 0;
};

/**
 * Calculate the percentage change for a stock
 */
export const calculatePercentChange = (stock, stockData) => {
  // Check if all required data exists
  if (!stock || !stock.symbol || !stock.purchasePrice) {
    return 0;
  }
  
  // If the API has provided a percentage change
  if (stockData && 
      stockData[stock.symbol] && 
      stockData[stock.symbol].percentChange !== undefined && 
      !isNaN(stockData[stock.symbol].percentChange)) {
    return stockData[stock.symbol].percentChange;
  }
  
  // If we have current price but not percent change, calculate it
  if (stockData && 
      stockData[stock.symbol] && 
      stockData[stock.symbol].currentPrice && 
      !isNaN(stockData[stock.symbol].currentPrice)) {
    return ((stockData[stock.symbol].currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
  }
  
  // Default to 0 if we can't calculate
  return 0;
};