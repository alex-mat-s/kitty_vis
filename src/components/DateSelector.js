import React from 'react';

const DateSelector = ({ onDateChange }) => {
  return (
    <div>
      <label>Select a date: </label>
      <input type="date" onChange={(e) => onDateChange(e.target.value)} />
    </div>
  );
};

export default DateSelector;