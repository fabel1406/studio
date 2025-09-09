
// src/app/dashboard/impact/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ImpactCharts from "@/components/impact-charts";
import { DollarSign, Globe, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getImpactMetrics, type CalculatedImpactMetrics } from "@/services/impact-service";
import { useRole } from "../role-provider";

export default function ImpactPage() {
    const { companyId } = useRole();
    const [metrics, setMetrics] = useState<CalculatedImpactMetrics | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadImpactData() {
            if (!companyId) return;
            setIsLoading(true);
            try {
                const impactData = await getImpactMetrics(companyId);
                setMetrics(impactData);
            } catch (error) {
                console.error("Failed to load impact data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadImpactData();
    }, [companyId]);

    if (isLoading) {
      return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )
    }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tu Impacto Real</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Residuos Desviados (kg)</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalWasteDiverted.toLocaleString() || 0} kg</div>
                <p className="text-xs text-muted-foreground">Total de tus negociaciones completadas</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Evitado (kg)</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{metrics?.totalCo2Avoided.toLocaleString() || 0} kg</div>
                <p className="text-xs text-muted-foreground">Equivalente a plantar {metrics?.equivalentTreesPlanted || 0} árboles</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Valor Económico Generado</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${metrics?.totalEconomicValue.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">Ahorros e ingresos totales generados</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Desglose de Impacto Mensual</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ImpactCharts monthlyData={metrics?.monthlyImpact || []} />
        </CardContent>
      </Card>
    </div>
  );
}
