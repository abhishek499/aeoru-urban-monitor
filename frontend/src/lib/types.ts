export interface SensorData {
  id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'pressure' | 'air_quality';
  location: string;
  value: number;
  unit: string;
  timestamp: string;
  status: 'online' | 'offline' | 'warning' | 'error';
}

export interface SensorReliability {
  sensorId: string;
  score: number;
  variance: number;
  updateFrequency: number;
  lastUpdated: string;
}

export interface SensorStats {
  min: number;
  max: number;
  avg: number;
  total: number;
  count: number;
}

export interface DataPoint {
  timestamp: string;
  value: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface BarData {
  name: string;
  value: number;
}

export type TimeRange = '1h' | '24h' | '7d' | '30d' | 'all';
