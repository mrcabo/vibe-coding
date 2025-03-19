import { useState } from 'react';

const AddStockForm = ({ onAddStock }) => {
  const [formData, setFormData] = useState({
    symbol: '',
    companyName: '',
    purchasePrice: '',
    investment: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.symbol || !formData.companyName || !formData.purchasePrice || !formData.investment) {
      setError('All fields are required');
      return;
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    const investment = parseFloat(formData.investment);

    if (isNaN(purchasePrice) || purchasePrice <= 0) {
      setError('Purchase price must be a positive number');
      return;
    }

    if (isNaN(investment) || investment <= 0) {
      setError('Investment amount must be a positive number');
      return;
    }

    // Submit the stock
    onAddStock({
      symbol: formData.symbol.toUpperCase(),
      companyName: formData.companyName,
      purchasePrice,
      investment
    });

    // Reset form
    setFormData({
      symbol: '',
      companyName: '',
      purchasePrice: '',
      investment: ''
    });
    setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-gray-50">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="symbol" className="block text-sm font-medium mb-1">
          Stock Symbol
        </label>
        <input
          type="text"
          id="symbol"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          placeholder="AAPL"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="companyName" className="block text-sm font-medium mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="companyName"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
          placeholder="Apple Inc."
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="purchasePrice" className="block text-sm font-medium mb-1">
          Purchase Price per Share ($)
        </label>
        <input
          type="number"
          id="purchasePrice"
          name="purchasePrice"
          value={formData.purchasePrice}
          onChange={handleChange}
          placeholder="150.00"
          min="0.01"
          step="0.01"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <div>
        <label htmlFor="investment" className="block text-sm font-medium mb-1">
          Total Investment ($)
        </label>
        <input
          type="number"
          id="investment"
          name="investment"
          value={formData.investment}
          onChange={handleChange}
          placeholder="5000.00"
          min="0.01"
          step="0.01"
          className="w-full p-2 border rounded"
        />
      </div>
      
      <button
        type="submit"
        className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Add Stock
      </button>
    </form>
  );
};

export default AddStockForm;