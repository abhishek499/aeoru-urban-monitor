import type { SensorData, SensorReliability } from './types';
import { format, subHours, subDays } from 'date-fns';

// Generate mock sensor data
export const generateMockSensors = (count = 10): SensorData[] => {
  const types = ['temperature', 'humidity', 'pressure', 'air_quality'] as const;
  const statuses = ['online', 'offline', 'warning', 'error'] as const;
  const locations = ['Server Room', 'Office', 'Warehouse', 'Production Floor', 'Data Center'];

  return Array.from({ length: count }).map((_, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    let value: number;
    let unit: string;

    switch (type) {
      case 'temperature':
        value = Number.parseFloat((Math.random() * 35 + 15).toFixed(1)); // 15-50°C
        unit = '°C';
        break;
      case 'humidity':
        value = Number.parseFloat((Math.random() * 60 + 20).toFixed(1)); // 20-80%
        unit = '%';
        break;
      case 'pressure':
        value = Number.parseFloat((Math.random() * 50 + 980).toFixed(1)); // 980-1030 hPa
        unit = 'hPa';
        break;
      case 'air_quality':
        value = Math.floor(Math.random() * 500); // 0-500 AQI
        unit = 'AQI';
        break;
    }

    // Randomly assign statuses with a bias toward online
    const statusIndex = Math.random() > 0.7
      ? Math.floor(Math.random() * 4)
      : 0; // 70% chance to be online

    return {
      id: `sensor-${index + 1}`,
      name: `Sensor ${index + 1}`,
      type,
      location: locations[Math.floor(Math.random() * locations.length)],
      value,
      unit,
      timestamp: new Date().toISOString(),
      status: statuses[statusIndex],
    };
  });
};

// Generate historical data for a sensor
export const generateHistoricalData = (
  sensorId: string,
  hours = 24,
  interval = 15 // in minutes
) => {
  const data = [];
  const now = new Date();

  for (let i = hours; i >= 0; i--) {
    for (let j = 60; j >= 0; j -= interval) {
      const timestamp = subHours(now, i);
      timestamp.setMinutes(j);

      // Add some randomness to the data
      const baseValue = 50 + Math.random() * 50;
      // Add some sine wave pattern for realism
      const value = baseValue + Math.sin(i * Math.PI / 12) * 10;

      data.push({
        timestamp: timestamp.toISOString(),
        value: Number.parseFloat(value.toFixed(1)),
      });
    }
  }

  return data;
};

// Calculate reliability score based on data variance and update frequency
export const calculateReliabilityScore = (
  sensorId: string,
  dataPoints: Array<{ timestamp: string; value: number }>,
): SensorReliability => {
  // Calculate variance
  if (dataPoints.length < 2) {
    return {
      sensorId,
      score: 0,
      variance: 0,
      updateFrequency: 0,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Calculate mean
  const values = dataPoints.map(dp => dp.value);
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;

  // Calculate variance
  const variance = Math.sqrt(
    values.reduce((sum, val) => sum + (val - mean) ** 2, 0) / values.length
  );

  // Calculate update frequency (average time between updates in minutes)
  const timestamps = dataPoints.map(dp => new Date(dp.timestamp).getTime());
  let totalGap = 0;
  for (let i = 1; i < timestamps.length; i++) {
    totalGap += (timestamps[i - 1] - timestamps[i]) / (1000 * 60); // Convert ms to minutes
  }
  const updateFrequency = Math.abs(totalGap / (timestamps.length - 1));

  // Calculate reliability score (higher is better)
  // Normalize variance to 0-1 range (lower variance is better)
  const normalizedVariance = Math.min(variance / 100, 1);

  // Normalize update frequency (updates every 5-15 minutes is ideal)
  let frequencyScore: number;
  if (updateFrequency < 1) {
    frequencyScore = updateFrequency; // Too frequent updates (< 1 min) get lower score
  } else if (updateFrequency > 60) {
    frequencyScore = 60 / updateFrequency; // Infrequent updates (> 1 hour) get lower score
  } else {
    frequencyScore = 1 - Math.abs(updateFrequency - 15) / 15; // 15 minutes is ideal
  }

  // Combine scores (weight variance more)
  const score = (1 - normalizedVariance) * 0.7 + frequencyScore * 0.3;

  return {
    sensorId,
    score: Number.parseFloat((score * 100).toFixed(1)),
    variance: Number.parseFloat(variance.toFixed(2)),
    updateFrequency: Number.parseFloat(updateFrequency.toFixed(2)),
    lastUpdated: dataPoints[0].timestamp,
  };
};

// Mock data for initial load
export const initialSensors = generateMockSensors(12);

// Generate reliability scores for all sensors
export const generateReliabilityScores = () => {
  return initialSensors.map(sensor => {
    const historicalData = generateHistoricalData(sensor.id);
    return calculateReliabilityScore(sensor.id, historicalData);
  });
};

// Initial reliability scores
export const initialReliabilityScores = generateReliabilityScores();
