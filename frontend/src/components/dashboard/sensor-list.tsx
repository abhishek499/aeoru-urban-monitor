"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ReliabilityScore } from '@/components/ui/reliability-score';
import { useDashboard } from '@/context/dashboard-context';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSensorDashboard } from '@/hooks/useDashboardSocket';

interface SensorListProps {
  className?: string;
}

export function SensorList({ className }: SensorListProps) {
  const {
    // sensors,
    reliabilityScores,
    selectedSensorId,
    selectSensor
  } = useDashboard();
    const { dashboard, sensors } = useSensorDashboard();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sensors</CardTitle>
      </CardHeader>
      <CardContent className='h-[400px] overflow-y-auto'>
        <div className="space-y-2">
          {Array.from(
  new Map(sensors.map(item => [item.sensor_id, item])).values()
).map(sensor => {
            const reliability = reliabilityScores.find(
              r => r.sensorId === sensor.sensor_id

            );

            return (
              <div
                key={sensor.sensor_id
                }
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-colors",
                  sensor.sensor_id
                  === selectedSensorId
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                )}
                onClick={() => selectSensor(sensor.sensor_id
                )}
              >
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{sensor.name}</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      {sensor.location} • {sensor.type.replace('_', ' ')}
                    </p>
                  </div>
                  <StatusBadge status={['online', 'offline', 'warning', 'error'].includes(sensor.status) ? sensor.status as 'online' | 'offline' | 'warning' | 'error' : 'error'} />
                </div>

                <div className="mt-3 flex justify-between items-baseline">
                  <div className="text-lg font-semibold">
                    {sensor.value} <span className="text-xs text-zinc-500">{sensor.unit}</span>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDistanceToNow(new Date(sensor.timestamp), { addSuffix: true })}
                  </div>
                </div>

                {reliability && (
                  <div className="mt-3">
                    <ReliabilityScore
                      score={reliability.score}
                      size="sm"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
