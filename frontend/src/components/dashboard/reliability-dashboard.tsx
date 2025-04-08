"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/context/dashboard-context';
import { ReliabilityScore } from '@/components/ui/reliability-score';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ReliabilityDashboardProps {
  className?: string;
}

export function ReliabilityDashboard({ className }: ReliabilityDashboardProps) {
  const { reliabilityScores, sensors, loading } = useDashboard();

  // Prepare data for the bar chart
  const chartData = React.useMemo(() => {
    return reliabilityScores
      .slice()
      .sort((a, b) => b.score - a.score)
      .map(score => {
        const sensor = sensors.find(s => s.id === score.sensorId);
        return {
          name: sensor?.name || score.sensorId,
          score: score.score,
        };
      });
  }, [reliabilityScores, sensors]);

  // Loading state
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Sensor Reliability Scores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Reliability Score']}
                labelFormatter={(label) => `Sensor: ${label}`}
              />
              <Bar
                dataKey="score"
                fill="#3b82f6"
                name="Reliability Score"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-8 space-y-4">
          <div className="text-sm font-medium">Reliability Details</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reliabilityScores.map(score => {
              const sensor = sensors.find(s => s.id === score.sensorId);
              if (!sensor) return null;

              return (
                <div
                  key={score.sensorId}
                  className="border rounded-lg p-4 dark:border-zinc-800"
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <h3 className="font-medium">{sensor.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        {sensor.type.replace('_', ' ')} • {sensor.location}
                      </p>
                    </div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">
                      Updated {formatDistanceToNow(new Date(score.lastUpdated), { addSuffix: true })}
                    </div>
                  </div>

                  <ReliabilityScore score={score.score} />

                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="space-y-1">
                      <p className="text-zinc-500 dark:text-zinc-400">Data Variance</p>
                      <p className="font-medium">{score.variance.toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-zinc-500 dark:text-zinc-400">Update Frequency</p>
                      <p className="font-medium">{score.updateFrequency.toFixed(1)} min</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
