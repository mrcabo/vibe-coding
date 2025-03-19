import { calculateStockValue, calculatePercentChange } from '../lib/portfolioUtils';

const PortfolioList = ({ portfolio, stockData, onRemove }) => {
  if (!portfolio || portfolio.length === 0) {
    return (
      <div className="text-center p-4 border rounded bg-gray-50">
        <p>Your portfolio is empty. Add some stocks to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Symbol</th>
            <th className="p-2 text-left">Company</th>
            <th className="p-2 text-right">Shares</th>
            <th className="p-2 text-right">Purchase Price</th>
            <th className="p-2 text-right">Current Price</th>
            <th className="p-2 text-right">Total Value</th>
            <th className="p-2 text-right">Change</th>
            <th className="p-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {portfolio.map((stock) => {
            const currentValue = calculateStockValue(stock, stockData);
            const percentChange = calculatePercentChange(stock, stockData);
            const isPositiveChange = percentChange >= 0;
            
            return (
              <tr key={stock.symbol} className="border-b hover:bg-gray-50">
                <td className="p-2 font-medium">{stock.symbol}</td>
                <td className="p-2">{stock.companyName}</td>
                <td className="p-2 text-right">{stock.shares}</td>
                <td className="p-2 text-right">${stock.purchasePrice.toFixed(2)}</td>
                <td className="p-2 text-right">
                  {stockData[stock.symbol] 
                    ? `$${stockData[stock.symbol].currentPrice.toFixed(2)}` 
                    : '-'}
                </td>
                <td className="p-2 text-right">${currentValue.toFixed(2)}</td>
                <td className={`p-2 text-right ${isPositiveChange ? 'text-green-600' : 'text-red-600'}`}>
                  {isPositiveChange ? '+' : ''}{percentChange.toFixed(2)}%
                </td>
                <td className="p-2 text-center">
                  <button
                    onClick={() => onRemove(stock.symbol)}
                    className="text-red-600 hover:text-red-800"
                    aria-label={`Remove ${stock.symbol}`}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioList;