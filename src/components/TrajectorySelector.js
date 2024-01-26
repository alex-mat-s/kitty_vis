import React from 'react';

const TrajectorySelector = ({ data, onSelect }) => {
    // Sort data array alphabetically based on the identifier
  const sortedData = [...data].sort((a, b) => a.identifier.localeCompare(b.identifier));

  const handleChange = (event) => {
    onSelect(event.target.value);
  };

  return (
    <select onChange={handleChange}>
      {sortedData.map((item, index) => (
        <option key={index} value={item.identifier}>
          {item.identifier}
        </option>
      ))}
    </select>
  );
};

export default TrajectorySelector;