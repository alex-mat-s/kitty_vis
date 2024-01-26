import React, { useState } from 'react';

const DateRangeSelector = ({ onDateRangeChange }) => {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleDateChange = () => {
    onDateRangeChange({ start, end });
  };

  return (
    <div>
      <label>Start Date: </label>
      <input type="date" value={start} onChange={(e) => setStart(e.target.value)} onBlur={handleDateChange} />

      <label>End Date: </label>
      <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} onBlur={handleDateChange} />
    </div>
  );
};

export default DateRangeSelector;