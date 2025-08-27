"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { mockImpactMetrics } from "@/lib/data";

const chartConfig = {
  wasteDiverted: {
    label: "Waste Diverted (kg)",
    color: "hsl(var(--chart-1))",
  },
  co2Avoided: {
    label: "CO₂ Avoided (kg)",
    color: "hsl(var(--chart-2))",
  },
};

export default function ImpactCharts() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={mockImpactMetrics}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="label"
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value} kg`}
        />
        <Tooltip
            contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
            }}
        />
        <Legend />
        <Bar dataKey="wasteDiverted" fill={chartConfig.wasteDiverted.color} name="Waste Diverted (kg)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="co2Avoided" fill={chartConfig.co2Avoided.color} name="CO₂ Avoided (kg)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
