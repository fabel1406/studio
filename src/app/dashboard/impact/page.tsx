import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ImpactCharts from "@/components/impact-charts";
import { mockImpactMetrics } from "@/lib/data";
import { BarChart, DollarSign, Globe, Trash2 } from "lucide-react";

export default function ImpactPage() {
    const totalWasteDiverted = mockImpactMetrics.reduce((sum, item) => sum + item.wasteDiverted, 0);
    const totalCo2Avoided = mockImpactMetrics.reduce((sum, item) => sum + item.co2Avoided, 0);
    const totalSavings = mockImpactMetrics.reduce((sum, item) => sum + item.savings, 0);

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Your Impact</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Waste Diverted (kg)</CardTitle>
                <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalWasteDiverted.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">From landfills in the last 6 months</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">CO₂ Avoided (kg)</CardTitle>
                <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{totalCo2Avoided.toLocaleString()} kg</div>
                <p className="text-xs text-muted-foreground">Equivalent to planting {Math.round(totalCo2Avoided / 21)} trees</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Economic Value Generated</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">${totalSavings.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total savings and revenue</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Impact Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <ImpactCharts />
        </CardContent>
      </Card>
    </div>
  );
}
