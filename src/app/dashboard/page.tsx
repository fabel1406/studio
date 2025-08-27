import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, BarChart2, Leaf, Recycle } from "lucide-react";
import Link from "next/link";
import ImpactCharts from "@/components/impact-charts";

const stats = [
    { title: "Active Listings", value: "12", icon: Leaf, change: "+2 this week" },
    { title: "Potential Matches", value: "45", icon: Recycle, change: "+5 this week" },
    { title: "CO₂ Avoided (kg)", value: "1,250", icon: BarChart2, change: "+150 this month" },
]

export default function DashboardOverviewPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                     <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.change}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Impact Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ImpactCharts />
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Matches</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={`https://picsum.photos/seed/avatar${i}/40`} alt="Avatar" />
                                        <AvatarFallback>C{i+1}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">BioGas Energía</p>
                                        <p className="text-sm text-muted-foreground">
                                            Match for 'Alperujo'
                                        </p>
                                    </div>
                                    <div className="ml-auto font-medium">85% score</div>
                                </div>
                            ))}
                        </div>
                        <Button asChild className="mt-4 w-full">
                            <Link href="/dashboard/matches">
                                View All Matches <ArrowUpRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
