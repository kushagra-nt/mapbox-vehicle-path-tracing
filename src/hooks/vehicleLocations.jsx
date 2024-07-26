// useVehicleData.js
import { useEffect, useState } from 'react';

const useVehicleData = () => {
  const [vehiclePath, setVehiclePath] = useState([]);

  useEffect(() => {
    // Simulate fetching vehicle data
    const fetchVehicleData = () => {
      setInterval(() => {
        setVehiclePath((prevPath) => {
          const lastPoint = prevPath[prevPath.length - 1] || {
            latitude: 37.753574, // Initial latitude
            longitude: -122.447303, // Initial longitude
          };

          const newPoint = {
            latitude: lastPoint.latitude + (Math.random() - 0.5) * 0.01,
            longitude: lastPoint.longitude + (Math.random() - 0.5) * 0.01,
            timestamp: Date.now(),
          };

          return [...prevPath, newPoint];
        });
      }, 2000);
    };

    fetchVehicleData();
    
    return () => {
      // Cleanup interval on unmount
      clearInterval(fetchVehicleData);
    };
  }, []);

  return vehiclePath;
};

export default useVehicleData;
