// hooks/useSensorDashboard.ts
import { useEffect, useState } from 'react';

interface DashboardSummary {
  total_sensors: number;
  online_sensors: number;
  warning_sensors: number;
  average_reliability: number;
}

interface SensorData {
  sensor_id: string;
  name: string;
  type: string;
  location: string;
  value: number;
  unit: string;
  timestamp: string;
  status: string;
  reliability_score: number | null;
  data_variance: number | null;
  update_frequency: number | null;
}

interface DashboardMessage {
  dashboard: DashboardSummary;
  sensors: SensorData[];
}

export const useSensorDashboard = () => {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [sensors, setSensors] = useState<SensorData[]>([]);

  useEffect(() => {
    const socket = new WebSocket('ws://khrk0p6k-8000.inc1.devtunnels.ms/ws/sensor-dashboard');

    socket.onmessage = (event) => {
      try {
        const data: DashboardMessage = JSON.parse(event.data);
        setDashboard(data.dashboard);
        setSensors(data.sensors);
      } catch (err) {
        console.error('Invalid WebSocket message:', err);
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
    };
  }, []);

  return { dashboard, sensors };
};
