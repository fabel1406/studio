// src/app/dashboard/impact/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ImpactCharts from "@/components/impact-charts";
import { mockImpactMetrics } from "@/lib/data";
import { BarChart, DollarSign, Globe, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function ImpactPage() {
    const [totalWasteDiverted, setTotalWasteDiverted] = useState(0);
    const [totalCo2Avoided, setTotalCo2Avoided] = useState(0);
    const [totalSavings, setTotalSavings] = useState(0);

    useEffect(() => {
        // In a real app, this data would likely come from a dedicated service
        // that aggregates historical data. For now, we sum the mock data.
        const waste = mockImpactMetrics.reduce((sum, item) => sum + item.wasteDiverted, 0);
        const co2 = mockImpactMetrics.reduce((sum, item) => sum + item.co2Avoided, 0);
        const savings = mockImpactMetrics.reduce((sum, item) => sum + item.savings, 0);
        
        setTotalWasteDiverted(waste);
        setTotalCo2Avoided(co2);
        setTotalSavings(savings);
    }, []);


  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tu Impacto</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Residuos Desviados (kg)</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalWasteDiverted.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">De vertederos en los últimos 6 meses</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Evitado (kg)</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCo2Avoided.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">Equivalente a plantar {Math.round(totalCo2Avoided / 21)} árboles</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Económico Generado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Ahorros e ingresos totales</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desglose de Impacto Mensual</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ImpactCharts />
        </CardContent>
      </Card>
    </div>
  );
}
