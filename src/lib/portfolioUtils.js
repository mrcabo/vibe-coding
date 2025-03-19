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
    if (stockData[stock.symbol] && stockData[stock.symbol].currentPrice) {
      const shares = stock.investment / stock.purchasePrice;
      return shares * stockData[stock.symbol].currentPrice;
    }
    return stock.investment;
  };
  
  /**
   * Calculate the percentage change for a stock
   */
  export const calculatePercentChange = (stock, stockData) => {
    if (stockData[stock.symbol] && stockData[stock.symbol].percentChange) {
      return stockData[stock.symbol].percentChange;
    }
    
    // If we have current price but not percent change
    if (stockData[stock.symbol] && stockData[stock.symbol].currentPrice) {
      return ((stockData[stock.symbol].currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
    }
    
    return 0;
  };