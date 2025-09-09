
// src/components/impact-charts.tsx
"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import type { MonthlyImpact } from "@/services/impact-service";

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

export default function ImpactCharts({ monthlyData }: { monthlyData: MonthlyImpact[] }) {
  if (monthlyData.length === 0) {
    return (
      <div className="flex h-[350px] w-full items-center justify-center text-muted-foreground">
        <p>Aún no hay datos suficientes para mostrar el gráfico. ¡Completa tu primera negociación!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
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
