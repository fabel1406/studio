// src/components/impact-charts.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { mockImpactMetrics } from "@/lib/data";

const chartConfig = {
  wasteDiverted: {
    label: "Residuos Desviados (kg)",
    color: "hsl(var(--chart-1))",
  },
  co2Avoided: {
    label: "CO₂ Evitado (kg)",
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
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--primary))',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
            cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
        />
        <Legend />
        <Bar dataKey="wasteDiverted" fill={chartConfig.wasteDiverted.color} name="Residuos Desviados (kg)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="co2Avoided" fill={chartConfig.co2Avoided.color} name="CO₂ Evitado (kg)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}