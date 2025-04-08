"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/context/dashboard-context';
import { format, parseISO } from 'date-fns';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface SensorChartProps {
  className?: string;
}

export function SensorChart({ className }: SensorChartProps) {
  const {
    historicalData,
    loading,
    error,
    selectedSensorId,
    selectedTimeRange,
    sensors
  } = useDashboard();

  // Get selected sensor details
  const selectedSensor = React.useMemo(() => {
    return sensors.find(s => s.id === selectedSensorId);
  }, [selectedSensorId, sensors]);

  // Format data for chart
  const chartData = React.useMemo(() => {
    // Sample the data to keep chart performant
    const data = [...historicalData];

    // Reduce data points based on time range to avoid overcrowding
    let sampledData = data;
    if (data.length > 100) {
      const sampleRate = Math.ceil(data.length / 100);
      sampledData = data.filter((_, index) => index % sampleRate === 0);
    }

    return sampledData.map(point => ({
      ...point,
      formattedTime: format(parseISO(point.timestamp),
        selectedTimeRange === '1h' ? 'HH:mm' :
        selectedTimeRange === '24h' ? 'HH:mm' :
        'MMM dd'
      )
    }));
  }, [historicalData, selectedTimeRange]);

  // Handle loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <Skeleton className="h-[250px] w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-red-500">Error Loading Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex flex-col items-center justify-center text-center">
            <span className="text-red-500 text-lg mb-2">⚠️</span>
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">{error}</p>
            <button
              className="px-4 py-2 text-sm rounded-md bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle no sensor selected
  if (!selectedSensorId) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Sensor Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              Select a sensor to view its data over time
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Handle no data
  if (chartData.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            {selectedSensor?.name || 'Sensor'} Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-center">
            <p className="text-zinc-500 dark:text-zinc-400">
              No data available for the selected time range
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          {selectedSensor?.name || 'Sensor'} Data {selectedSensor && `(${selectedSensor.unit})`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="formattedTime"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#888' }}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: '#888' }}
                domain={['auto', 'auto']}
                label={{
                  value: selectedSensor?.unit || '',
                  angle: -90,
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip
                formatter={(value) => [`${value} ${selectedSensor?.unit || ''}`, 'Value']}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={false}
                name={selectedSensor?.type || 'Value'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
