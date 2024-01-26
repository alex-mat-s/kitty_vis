import React, { useState, useEffect } from 'react';
import MapVisualization from './components/MapVisualization';
import TrajectorySelector from './components/TrajectorySelector';
// import { processData } from './utils/processData';
import './styles.css';
import * as d3 from 'd3';
import DistanceGraph from './components/DistanceGraph';
import { calculateDistance } from './utils/calculateDistance'
// import DateRangeSelector from './components/DateRangeSelector';

const filePath = process.env.PUBLIC_URL + '/Pet Cats Australia.csv';
const App = () => {
  const [data, setData] = useState([]);
  const [selectedObject, setSelectedObject] = useState(null);
  const [clickedTimestamp, setClickedTimestamp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const rawData = await d3.csv(filePath);
        const processedData = processTrajectoryData(rawData);
        setData(processedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading the CSV data", error);
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const processTrajectoryData = (rawData) => {
    let processedData = {};
    rawData.forEach(item => {
      const id = item['tag-local-identifier'];
      if (!processedData[id]) {
        processedData[id] = { trajectory: [], distances: [], timestamps: [] };
      }
      const coordLength = processedData[id].trajectory.length;
      const lastCoord = coordLength > 0 ? processedData[id].trajectory[coordLength - 1] : null;
      const newCoord = {
        longitude: +item['location-long'],
        latitude: +item['location-lat'],
        timestamp: item['timestamp']
      };
      processedData[id].trajectory.push(newCoord);
      if (lastCoord) {
        const distance = calculateDistance(lastCoord.latitude, lastCoord.longitude, newCoord.latitude, newCoord.longitude);
        processedData[id].distances.push(distance);
      } else {
        processedData[id].distances.push(0);
      }
    });

    return Object.keys(processedData).map(key => ({
      identifier: key,
      trajectory: processedData[key].trajectory,
      distances: processedData[key].distances,
      timestamps: processedData[key].trajectory.map(point => point.timestamp)
    }));
  };

  const handleObjectSelect = (object) => {
    setSelectedObject(object);
    setClickedTimestamp(null); // Reset clicked timestamp when a new object is selected
  };

  const handleGraphPointClick = (timestamp) => {
    // Ensure the selected object exists in the data array
    if (data.some(obj => obj.identifier === selectedObject)) {
      setClickedTimestamp(timestamp);
    } else {
      setClickedTimestamp(null);
    }
  };

  return (
    <div className="app-container">
      {isLoading ? (
        <div className='spinner'></div>
      ) : (
        <>
          <h1 class="custom-colored-h1">Where are you, kitty?</h1>
          <label>Please, choose the Name Tag:</label>
          <div id="traj_sel">
            <TrajectorySelector data={data} onSelect={handleObjectSelect} />
          </div>
          <div className="visualization-container">
            <div id='map'>
              <MapVisualization 
                data={data} 
                selectedObject={selectedObject} 
                clickedTimestamp={clickedTimestamp}
              />
            </div>
            
            <div id='graph'>
              {selectedObject && (
                <DistanceGraph 
                  distances={data.find(obj => obj.identifier === selectedObject).distances}
                  timestamps={data.find(obj => obj.identifier === selectedObject).timestamps}
                  onPointClick={handleGraphPointClick}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;