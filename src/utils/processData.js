import * as d3 from 'd3';

// Function to calculate the distances based on coordinates
export const calculateDistances = (data) => {

    let distances = data.map((d, i, arr) => {
        if (i === 0) return 0;
        const prev = arr[i - 1];
        const distance = d3.geoDistance([prev.longitude, prev.latitude], [d.longitude, d.latitude]);
        return distance;
    });

    // Return the calculated distances
    return distances;
};

export const processData = (rawData) => {
    const processedData = rawData.reduce((acc, d) => {
      // Assuming 'tag-local-identifier', 'location-long', and 'location-lat' are columns in your CSV
      const id = d['tag-local-identifier'];
      const coords = {
        longitude: parseFloat(d['location-long']),
        latitude: parseFloat(d['location-lat'])
      };
  
      if (!acc[id]) {
        acc[id] = { identifier: id, trajectory: [] };
      }
      acc[id].trajectory.push(coords);
      return acc;
    }, {});
  
    return Object.values(processedData);
  };