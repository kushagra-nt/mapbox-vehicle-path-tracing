import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl"; // eslint-disable-line import/no-webpack-loader-syntax
import useVehicleData from './hooks/vehicleLocations'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export default function Map() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const vehiclePath = useVehicleData();

  useEffect(() => {
    // Initialize map
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-122.447303, 37.753574],
      zoom: 12,
    });

    // Add navigation control (zoom buttons)
    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    // Add the cart icon image to the map
    mapRef.current.on('load', () => {
      mapRef.current.loadImage(import.meta.env.VITE_CAR_IMAGE, (error, image) => {
        if (error) throw error;
        mapRef.current.addImage('cart-icon', image);
      });
    });

    return () => {
      mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && vehiclePath.length) {
      // Update vehicle position on the map
      const latestPosition = vehiclePath[vehiclePath.length - 1];

      // Add or update the marker with the cart icon
      if (mapRef.current.getSource('vehicleMarker')) {
        mapRef.current.getSource('vehicleMarker').setData({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [latestPosition.longitude, latestPosition.latitude],
          },
        });
      } else {
        mapRef.current.addSource('vehicleMarker', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [latestPosition.longitude, latestPosition.latitude],
            },
          },
        });

        mapRef.current.addLayer({
          id: 'vehicleMarker',
          type: 'symbol',
          source: 'vehicleMarker',
          layout: {
            'icon-image': 'cart-icon',
            'icon-size': 0.2, // Adjust size as needed
          },
        });
      }

      // Draw the path
      const pathCoordinates = vehiclePath.map((point) => [
        point.longitude,
        point.latitude,
      ]);

      if (mapRef.current.getSource("vehiclePath")) {
        mapRef.current.getSource("vehiclePath").setData({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: pathCoordinates,
          },
        });
      } else {
        mapRef.current.addSource("vehiclePath", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: pathCoordinates,
            },
          },
        });

        mapRef.current.addLayer({
          id: "vehiclePath",
          type: "line",
          source: "vehiclePath",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ff0000",
            "line-width": 4,
          },
        });
      }
    }
  }, [vehiclePath]);

  return (
    <div ref={mapContainerRef} style={{ width: "100vw", height: "100vh" }} />
  );
}
