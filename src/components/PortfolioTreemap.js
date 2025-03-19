import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateStockValue, calculatePercentChange } from '../lib/portfolioUtils';

const PortfolioTreemap = ({ portfolio, stockData, isLoading }) => {
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

  // Prepare data for treemap
  const data = portfolio.map((stock) => {
    // Ensure we have stock data before calculating
    const currentValue = calculateStockValue(stock, stockData);
    const percentChange = calculatePercentChange(stock, stockData);
    
    return {
      name: stock.symbol,
      size: currentValue > 0 ? currentValue : 0.01, // Ensure positive size value
      percentChange: percentChange || 0, // Default to 0 if undefined
      companyName: stock.companyName || '',
      currentValue: currentValue.toFixed(2),
      investment: stock.investment.toFixed(2)
    };
  });

  // Color calculation function based on percent change
  const getColorByPercentChange = (percentChange) => {
    // Set color intensity based on percentage change
    // Red for negative, green for positive
    const isPositive = percentChange >= 0;
    const absPercentChange = Math.abs(percentChange);
    let intensity = Math.min(absPercentChange * 8, 100); // Scale percentage for better visualization
    
    if (isPositive) {
      // Green shades for positive
      const greenIntensity = Math.floor((intensity / 100) * 200); // 0-200 scale
      return `rgb(0, ${55 + greenIntensity}, 0)`;
    } else {
      // Red shades for negative
      const redIntensity = Math.floor((intensity / 100) * 200); // 0-200 scale
      return `rgb(${155 + redIntensity}, 0, 0)`;
    }
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0 && payload[0].payload) {
      const data = payload[0].payload;
      
      // Safely check if percentChange exists
      const percentChange = typeof data.percentChange === 'number' ? data.percentChange : 0;
      const isPositive = percentChange >= 0;
      
      return (
        <div className="p-3 bg-white border rounded shadow">
          <h3 className="font-bold">{data.name || 'Unknown'} {data.companyName ? `(${data.companyName})` : ''}</h3>
          <p>Current Value: ${data.currentValue || '0.00'}</p>
          <p>Initial Investment: ${data.investment || '0.00'}</p>
          <p className={isPositive ? 'text-green-600' : 'text-red-600'}>
            Change: {isPositive ? '+' : ''}{percentChange.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border rounded bg-white p-4 h-96">
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={data}
          dataKey="size"
          nameKey="name"
          stroke="#fff"
          fill="#8884d8"
          content={<CustomTreemapContent />}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
};

// Custom treemap content component
const CustomTreemapContent = ({ root, depth, x, y, width, height, index, payload, colors, rank, name }) => {
  // Check if payload exists before accessing its properties
  if (!payload) {
    return null;
  }
  
  const percentChange = payload.percentChange || 0;
  const isPositive = percentChange >= 0;
  
  // Generate background color based on percent change
  const getBackgroundColor = () => {
    // Normalize percent change to control color intensity
    const absChange = Math.abs(percentChange);
    const intensity = Math.min(absChange / 10, 1); // Cap at 10% change for full color
    
    if (isPositive) {
      // Green gradient for positive
      return `rgba(0, ${Math.floor(128 + 127 * intensity)}, 0, 0.9)`;
    } else {
      // Red gradient for negative
      return `rgba(${Math.floor(128 + 127 * intensity)}, 0, 0, 0.9)`;
    }
  };
  
  // Calculate text color for contrast
  const getTextColor = () => {
    const absChange = Math.abs(percentChange);
    // Use white text for darker backgrounds (higher percent changes)
    return absChange > 3 ? '#ffffff' : '#000000';
  };
  
  const backgroundColor = getBackgroundColor();
  const textColor = getTextColor();
  
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={backgroundColor}
        stroke="#ffffff"
        strokeWidth={2}
      />
      {width > 30 && height > 30 ? (
        <text
          x={x + width / 2}
          y={y + height / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={Math.min(width, height) > 50 ? 14 : 12}
          fontWeight="bold"
        >
          {payload.name}
        </text>
      ) : null}
      {width > 60 && height > 40 ? (
        <text
          x={x + width / 2}
          y={y + height / 2 + 14}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={12}
        >
          {isPositive ? '+' : ''}{percentChange.toFixed(1)}%
        </text>
      ) : null}
    </g>
  );
};

export default PortfolioTreemap;