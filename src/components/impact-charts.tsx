
// src/components/impact-charts.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import type { ImpactMetric } from "@/lib/types";

// Temporary mock data until a real service is implemented
const mockImpactMetrics: ImpactMetric[] = [
  { label: 'Ene', co2Avoided: 350, wasteDiverted: 500, savings: 2000 },
  { label: 'Feb', co2Avoided: 400, wasteDiverted: 550, savings: 2200 },
  { label: 'Mar', co2Avoided: 300, wasteDiverted: 480, savings: 1900 },
  { label: 'Abr', co2Avoided: 500, wasteDiverted: 620, savings: 2500 },
  { label: 'May', co2Avoided: 450, wasteDiverted: 600, savings: 2400 },
  { label: 'Jun', co2Avoided: 600, wasteDiverted: 750, savings: 3000 },
];

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
