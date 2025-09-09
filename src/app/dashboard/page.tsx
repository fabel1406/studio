
// src/app/dashboard/page.tsx
"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart2, Handshake, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";
import ImpactCharts from "@/components/impact-charts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRole } from "./role-provider";
import { useEffect, useState } from "react";
import { getAllResidues } from "@/services/residue-service";
import { getAllNegotiationsForUser } from "@/services/negotiation-service";
import { getImpactMetrics } from "@/services/impact-service";
import type { Negotiation, ImpactMetric } from "@/lib/types";

export default function DashboardOverviewPage() {
    const { companyId, user } = useRole();
    const [isLoading, setIsLoading] = useState(true);
    const [activeListings, setActiveListings] = useState(0);
    const [activeNegotiationsCount, setActiveNegotiationsCount] = useState(0);
    const [totalCo2Avoided, setTotalCo2Avoided] = useState(0);
    const [recentNegotiations, setRecentNegotiations] = useState<Negotiation[]>([]);
    const [monthlyImpact, setMonthlyImpact] = useState<any[]>([]);

    useEffect(() => {
        async function loadDashboardData() {
            if (companyId) {
                setIsLoading(true);
                try {
                    const [residues, negotiations, impact] = await Promise.all([
                        getAllResidues(),
                        getAllNegotiationsForUser(companyId),
                        getImpactMetrics(companyId)
                    ]);
    
                    // Filter active listings for the current user
                    const userResidues = residues.filter(r => r.companyId === companyId && r.status === 'ACTIVE');
                    setActiveListings(userResidues.length);
    
                    // Filter and count active negotiations
                    const allNegotiations = [...negotiations.sent, ...negotiations.received];
                    const activeNegotiations = allNegotiations.filter(n => n.status === 'SENT');
                    setActiveNegotiationsCount(activeNegotiations.length);
    
                    // Set recent negotiations for display
                    const sortedNegotiations = allNegotiations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setRecentNegotiations(sortedNegotiations.slice(0, 5));
    
                    // Set impact metrics
                    setTotalCo2Avoided(impact.totalCo2Avoided);
                    setMonthlyImpact(impact.monthlyImpact);

                } catch (error) {
                    console.error("Failed to load dashboard data:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        }
        if (user) { // Only run if user is loaded
            loadDashboardData();
        }
    }, [companyId, user]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Panel de control</h2>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Listados Activos
                        </CardTitle>
                        <Leaf className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeListings}</div>
                        <p className="text-xs text-muted-foreground">
                            Residuos actualmente en el marketplace.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Negociaciones Activas
                        </CardTitle>
                        <Handshake className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeNegotiationsCount}</div>
                        <p className="text-xs text-muted-foreground">
                           Solicitudes y ofertas pendientes.
                        </p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                             CO₂ Evitado (kg)
                        </CardTitle>
                        <BarChart2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalCo2Avoided.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Impacto total hasta la fecha.
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Resumen de Impacto Mensual</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ImpactCharts monthlyData={monthlyImpact} />
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Negociaciones Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentNegotiations.length > 0 ? (
                                recentNegotiations.map((neg) => {
                                    const otherParty = neg.requesterId === companyId ? neg.supplier : neg.requester;
                                    return (
                                         <div key={neg.id} className="flex items-center">
                                            <Avatar className="h-9 w-9">
                                                <AvatarFallback>{otherParty?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="ml-4 space-y-1">
                                                <p className="text-sm font-medium leading-none">{otherParty?.name}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Negociación para '{neg.residue.type}'
                                                </p>
                                            </div>
                                             <Link href={`/dashboard/negotiations/${neg.id}`} className="ml-auto">
                                                <Button variant="ghost" size="sm">Ver</Button>
                                             </Link>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-10">No hay negociaciones recientes.</p>
                            )}
                        </div>
                         {recentNegotiations.length > 0 && (
                            <Button asChild className="mt-4 w-full">
                                <Link href="/dashboard/negotiations">
                                    Ver todas las negociaciones <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                         )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
