const TimeRangeSelector = ({ selectedRange, onChange }) => {
    const timeRanges = [
      { value: '1m', label: '1 Month' },
      { value: '3m', label: '3 Months' },
      { value: '6m', label: '6 Months' },
      { value: '1y', label: '1 Year' }
    ];
  
    return (
      <div className="flex items-center space-x-2">
        <label htmlFor="timeRange" className="text-sm font-medium">
          Time Range:
        </label>
        <select
          id="timeRange"
          value={selectedRange}
          onChange={(e) => onChange(e.target.value)}
          className="p-1 border rounded"
        >
          {timeRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default TimeRangeSelector;