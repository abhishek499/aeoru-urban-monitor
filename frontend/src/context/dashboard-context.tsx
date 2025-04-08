"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import type { SensorData, SensorReliability, TimeRange } from '@/lib/types';
import {
  initialSensors,
  initialReliabilityScores,
  generateMockSensors,
  calculateReliabilityScore,
  generateHistoricalData
} from '@/lib/mock-data';

interface DashboardContextType {
  sensors: SensorData[];
  reliabilityScores: SensorReliability[];
  selectedTimeRange: TimeRange;
  selectedSensorId: string | null;
  loading: boolean;
  error: string | null;
  historicalData: Array<{ timestamp: string; value: number }>;
  selectTimeRange: (range: TimeRange) => void;
  selectSensor: (sensorId: string) => void;
  refreshData: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [sensors, setSensors] = useState<SensorData[]>(initialSensors);
  const [reliabilityScores, setReliabilityScores] = useState<SensorReliability[]>(initialReliabilityScores);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('24h');
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [historicalData, setHistoricalData] = useState<Array<{ timestamp: string; value: number }>>([]);

  // Simulate real-time data updates
  useEffect(() => {
    const updateInterval = setInterval(() => {
      try {
        // Update a random sensor with new data
        setSensors(prevSensors => {
          const updatedSensors = [...prevSensors];
          const randomIndex = Math.floor(Math.random() * updatedSensors.length);
          const sensorToUpdate = { ...updatedSensors[randomIndex] };

          // Update value based on sensor type
          switch (sensorToUpdate.type) {
            case 'temperature':
              sensorToUpdate.value = Number.parseFloat((sensorToUpdate.value + (Math.random() * 2 - 1)).toFixed(1));
              break;
            case 'humidity':
              sensorToUpdate.value = Number.parseFloat((sensorToUpdate.value + (Math.random() * 4 - 2)).toFixed(1));
              break;
            case 'pressure':
              sensorToUpdate.value = Number.parseFloat((sensorToUpdate.value + (Math.random() * 1 - 0.5)).toFixed(1));
              break;
            case 'air_quality':
              sensorToUpdate.value = Math.max(0, Math.min(500, sensorToUpdate.value + Math.floor(Math.random() * 10 - 5)));
              break;
          }

          // Randomly change status (10% chance)
          if (Math.random() < 0.1) {
            const statuses = ['online', 'offline', 'warning', 'error'] as const;
            sensorToUpdate.status = statuses[Math.floor(Math.random() * statuses.length)];
          }

          sensorToUpdate.timestamp = new Date().toISOString();
          updatedSensors[randomIndex] = sensorToUpdate;

          return updatedSensors;
        });

        // Update reliability scores every 5 sensor updates
        if (Math.random() < 0.2) {
          setReliabilityScores(prevScores => {
            return prevScores.map(scoreData => {
              const sensor = sensors.find(s => s.id === scoreData.sensorId);
              if (!sensor) return scoreData;

              // Get historical data and recalculate
              const historicalData = generateHistoricalData(sensor.id);
              return calculateReliabilityScore(sensor.id, historicalData);
            });
          });
        }
      } catch (err) {
        setError("Error updating sensor data");
        console.error(err);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(updateInterval);
  }, [sensors]);

  // Load historical data when sensor is selected
  useEffect(() => {
    if (!selectedSensorId) {
      setHistoricalData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert time range to hours
      let hours: number;
      switch (selectedTimeRange) {
        case '1h': hours = 1; break;
        case '24h': hours = 24; break;
        case '7d': hours = 24 * 7; break;
        case '30d': hours = 24 * 30; break;
        case 'all': hours = 24 * 90; break; // 3 months of data
      }

      // Simulate API call delay
      setTimeout(() => {
        const data = generateHistoricalData(selectedSensorId, hours);
        setHistoricalData(data);
        setLoading(false);
      }, 800);
    } catch (err) {
      setError("Failed to load historical data");
      setLoading(false);
      console.error(err);
    }
  }, [selectedSensorId, selectedTimeRange]);

  const selectTimeRange = (range: TimeRange) => {
    setSelectedTimeRange(range);
  };

  const selectSensor = (sensorId: string) => {
    setSelectedSensorId(sensorId);
  };

  const refreshData = () => {
    setLoading(true);

    // Simulate API refresh
    setTimeout(() => {
      try {
        const newSensors = generateMockSensors(sensors.length);
        setSensors(newSensors);

        const newReliabilityScores = newSensors.map(sensor => {
          const historicalData = generateHistoricalData(sensor.id);
          return calculateReliabilityScore(sensor.id, historicalData);
        });
        setReliabilityScores(newReliabilityScores);

        if (selectedSensorId) {
          const data = generateHistoricalData(selectedSensorId,
            selectedTimeRange === '1h' ? 1 :
            selectedTimeRange === '24h' ? 24 :
            selectedTimeRange === '7d' ? 24 * 7 :
            selectedTimeRange === '30d' ? 24 * 30 : 24 * 90
          );
          setHistoricalData(data);
        }

        setLoading(false);
        setError(null);
      } catch (err) {
        setError("Failed to refresh data");
        setLoading(false);
        console.error(err);
      }
    }, 1000);
  };

  return (
    <DashboardContext.Provider
      value={{
        sensors,
        reliabilityScores,
        selectedTimeRange,
        selectedSensorId,
        loading,
        error,
        historicalData,
        selectTimeRange,
        selectSensor,
        refreshData,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
