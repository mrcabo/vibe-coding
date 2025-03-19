"use client";

import { useState } from 'react';

const PortfolioIO = ({ portfolio, onImport }) => {
  const [importError, setImportError] = useState('');

  // Export portfolio data to a JSON file
  const handleExport = () => {
    if (!portfolio || portfolio.length === 0) {
      alert('Your portfolio is empty. Add some stocks before exporting.');
      return;
    }

    // Create a blob with the portfolio data
    const data = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `investment-portfolio-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import portfolio data from a JSON file
  const handleImport = (event) => {
    setImportError('');
    const file = event.target.files[0];
    
    if (!file) {
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        
        // Validate the imported data format
        if (!Array.isArray(importedData)) {
          setImportError('Invalid portfolio data format: Not an array');
          return;
        }
        
        // Check if each item has required fields
        const isValid = importedData.every(stock => 
          stock.symbol && 
          stock.companyName && 
          typeof stock.purchasePrice === 'number' && 
          (
            // Support both old (investment-based) and new (shares-based) formats
            (typeof stock.investment === 'number') || 
            (typeof stock.shares === 'number' && Number.isInteger(stock.shares))
          )
        );
        
        if (!isValid) {
          setImportError('Invalid portfolio data: Some stocks are missing required fields');
          return;
        }
        
        // Convert any old format items (without shares) to new format
        const normalizedData = importedData.map(stock => {
          if (typeof stock.shares !== 'number' && typeof stock.investment === 'number' && stock.purchasePrice > 0) {
            // Calculate shares from investment and purchase price
            const shares = Math.floor(stock.investment / stock.purchasePrice);
            return {
              ...stock,
              shares,
              investment: shares * stock.purchasePrice
            };
          }
          return stock;
        });
        
        // Ask if user wants to replace or merge portfolio
        if (portfolio && portfolio.length > 0) {
          const replace = window.confirm(
            'Do you want to replace your current portfolio? Click OK to replace, or Cancel to merge with your existing portfolio.'
          );
          
          if (replace) {
            // Replace entire portfolio
            onImport(normalizedData);
          } else {
            // Merge portfolios by combining stocks with the same symbol
            const mergedPortfolio = [...portfolio];
            const existingSymbols = new Set(portfolio.map(stock => stock.symbol));
            
            normalizedData.forEach(importedStock => {
              if (existingSymbols.has(importedStock.symbol)) {
                // Update existing stock by adding shares
                const existingIndex = mergedPortfolio.findIndex(s => s.symbol === importedStock.symbol);
                const existingStock = mergedPortfolio[existingIndex];
                
                // Calculate new totals
                const totalShares = existingStock.shares + importedStock.shares;
                const totalInvestment = existingStock.investment + importedStock.investment;
                const newAvgPrice = totalInvestment / totalShares;
                
                // Update the stock with combined values
                mergedPortfolio[existingIndex] = {
                  ...existingStock,
                  shares: totalShares,
                  investment: totalInvestment,
                  purchasePrice: newAvgPrice
                };
              } else {
                // Add new stock
                mergedPortfolio.push(importedStock);
                existingSymbols.add(importedStock.symbol);
              }
            });
            
            onImport(mergedPortfolio);
          }
        } else {
          // No existing portfolio, just import
          onImport(normalizedData);
        }
        
        // Reset the file input
        event.target.value = null;
      } catch (error) {
        setImportError(`Failed to parse import file: ${error.message}`);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading the file');
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex items-center space-x-4">
      <button
        onClick={handleExport}
        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
        title="Save your portfolio to a JSON file"
      >
        Export
      </button>
      
      <div className="relative">
        <label htmlFor="import-file" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm cursor-pointer">
          Import
        </label>
        <input
          type="file"
          id="import-file"
          accept=".json"
          onChange={handleImport}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          title="Load a portfolio from a JSON file"
        />
      </div>
      
      {importError && (
        <div className="text-red-600 text-sm">
          {importError}
        </div>
      )}
    </div>
  );
};

export default PortfolioIO;