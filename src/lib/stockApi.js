import axios from 'axios';

// You would need to sign up for a free API key
// For this example, we're using Alpha Vantage, but you can use any stock API
const API_KEY = 'YOUR_API_KEY';
const BASE_URL = 'https://www.alphavantage.co/query';

/**
 * Fetch current stock data for a list of symbols
 * @param {string[]} symbols - Array of stock symbols
 * @param {string} timeRange - Time range ('1m', '3m', '6m', '1y')
 * @returns {Promise<Object>} - Stock data keyed by symbol
 */
export const fetchStockData = async (symbols, timeRange) => {
  // For development/demo purposes, return mock data
  // In a real app, uncomment the API call below
  return getMockStockData(symbols, timeRange);
  
  /*
  try {
    const stockData = {};
    
    // Alpha Vantage has rate limits, so we need to fetch one at a time
    for (const symbol of symbols) {
      const response = await axios.get(BASE_URL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol: symbol,
          apikey: API_KEY,
          outputsize: 'compact'
        }
      });
      
      // Process the response data
      const timeSeries = response.data['Time Series (Daily)'];
      if (timeSeries) {
        const dates = Object.keys(timeSeries).sort().reverse();
        
        // Get current day data
        const currentData = timeSeries[dates[0]];
        const currentPrice = parseFloat(currentData['4. close']);
        
        // Get historical data based on timeRange
        let comparisonDate;
        switch (timeRange) {
          case '1m':
            comparisonDate = getDateXMonthsAgo(dates[0], 1);
            break;
          case '3m':
            comparisonDate = getDateXMonthsAgo(dates[0], 3);
            break;
          case '6m':
            comparisonDate = getDateXMonthsAgo(dates[0], 6);
            break;
          case '1y':
            comparisonDate = getDateXMonthsAgo(dates[0], 12);
            break;
          default:
            comparisonDate = getDateXMonthsAgo(dates[0], 1);
        }
        
        // Find the closest date to our comparison date
        let closestDate = dates[0];
        for (const date of dates) {
          if (date <= comparisonDate) {
            closestDate = date;
            break;
          }
        }
        
        const historicalData = timeSeries[closestDate];
        const historicalPrice = parseFloat(historicalData['4. close']);
        
        // Calculate percent change
        const percentChange = ((currentPrice - historicalPrice) / historicalPrice) * 100;
        
        stockData[symbol] = {
          currentPrice,
          historicalPrice,
          percentChange,
          lastUpdated: dates[0]
        };
      }
    }
    
    return stockData;
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return {};
  }
  */
};

/**
 * Get a date X months ago from a given date
 */
const getDateXMonthsAgo = (dateString, months) => {
  const date = new Date(dateString);
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
};

/**
 * Generate mock stock data for development/demo purposes
 */
const getMockStockData = (symbols, timeRange) => {
  const stockData = {};
  
  // For each symbol, generate realistic mock data
  symbols.forEach(symbol => {
    // Base percentage change on time range
    let basePercentChange;
    switch (timeRange) {
      case '1m':
        basePercentChange = Math.random() * 8 - 4; // -4% to +4%
        break;
      case '3m':
        basePercentChange = Math.random() * 15 - 7; // -7% to +8%
        break;
      case '6m':
        basePercentChange = Math.random() * 20 - 8; // -8% to +12%
        break;
      case '1y':
        basePercentChange = Math.random() * 30 - 10; // -10% to +20%
        break;
      default:
        basePercentChange = Math.random() * 8 - 4;
    }
    
    // Add some variation based on the symbol
    const symbolSeed = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const percentChange = basePercentChange + (symbolSeed % 10 - 5) / 10;
    
    // Mock current price (between $10 and $500)
    const currentPrice = 10 + (symbolSeed % 490);
    
    // Calculate historical price based on the percent change
    const historicalPrice = currentPrice / (1 + percentChange / 100);
    
    stockData[symbol] = {
      currentPrice,
      historicalPrice,
      percentChange,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
  });
  
  return stockData;
};