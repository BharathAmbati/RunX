"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp, Activity } from "lucide-react";

export const description = "A bar chart showing recent run distances";

const chartConfig = {
  distance: {
    label: "Distance",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

type ActivityChartProps = {
  data: {
    date: string;
    distance: number;
    time: string;
    pace: string;
  }[];
};

export function ActivityChart({ data }: ActivityChartProps) {
  // Take only the last 7 runs for the chart if there are more
  const chartData = [...data].reverse().slice(-7);

  const totalDistance = data.reduce((acc, curr) => acc + curr.distance, 0);
  const averageDistance = data.length > 0 ? totalDistance / data.length : 0;

  return (
    <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-sm h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle className="text-white font-exo2 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Performance
                </CardTitle>
                <CardDescription className="text-zinc-400">
                    Recent run distances
                </CardDescription>
            </div>
            {data.length > 1 && (
                <div className="text-right hidden sm:block">
                    <div className="text-2xl font-bold text-white font-mono">{totalDistance.toFixed(1)}<span className="text-sm text-zinc-500 font-sans ml-1">km</span></div>
                    <div className="text-xs text-zinc-500">Total (Last {data.length} runs)</div>
                </div>
            )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[200px]">
        <ChartContainer config={chartConfig} className="h-full w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value} // Date is already formatted
              stroke="#71717a"
              fontSize={12}
            />
            <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}k`}
                stroke="#71717a"
                fontSize={12}
            />
            <ChartTooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="distance"
              fill="#22d3ee" // Cyan 400
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
