// src/app/dashboard/negotiations/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockCompanies, mockResidues } from "@/lib/data";
import { Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Mock data, in a real app this would come from a service
const mockNegotiations = [
  {
    id: 'neg-1',
    residue: mockResidues[0],
    company: mockCompanies[0], // The company you are negotiating with
    quantity: 20,
    unit: 'TON',
    status: 'SENT',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'neg-2',
    residue: mockResidues[3],
    company: mockCompanies[3],
    quantity: 15,
    unit: 'TON',
    status: 'REVIEWED',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    REVIEWED: { text: 'En revisión', variant: 'secondary' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
}

export default function NegotiationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Negociaciones</h2>
          <p className="text-muted-foreground">
            Gestiona todas tus solicitudes y ofertas.
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="sent" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="sent">Mis Solicitudes</TabsTrigger>
          <TabsTrigger value="received">Solicitudes Recibidas</TabsTrigger>
        </TabsList>
        <TabsContent value="sent">
            <Card>
                <CardHeader>
                    <CardTitle>Solicitudes Enviadas</CardTitle>
                    <CardDescription>Aquí están las solicitudes de residuos que has enviado a los generadores.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockNegotiations.map((neg) => (
                         <div key={neg.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                            <Avatar className="h-12 w-12 hidden md:flex">
                                <AvatarImage src={neg.residue.photos?.[0]} alt={neg.residue.type} />
                                <AvatarFallback>{neg.residue.type.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <p className="font-semibold text-lg">{neg.residue.type}</p>
                                <p className="text-sm text-muted-foreground">
                                    Solicitud a <span className="text-primary font-medium">{neg.company.name}</span>
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-lg">{neg.quantity} {neg.unit}</p>
                                <p className="text-sm text-muted-foreground">Cantidad solicitada</p>
                            </div>
                             <div className="text-center">
                                <Badge variant={statusMap[neg.status].variant}>{statusMap[neg.status].text}</Badge>
                                <p className="text-sm text-muted-foreground mt-2">{format(new Date(neg.date), "d MMM, yyyy", { locale: es })}</p>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <Link href={`/dashboard/negotiations/${neg.id}`}>
                                    Ver Negociación <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                         </div>
                    ))}
                    {mockNegotiations.length === 0 && (
                        <div className="text-center py-16 text-muted-foreground">
                            <p>Aún no has enviado ninguna solicitud.</p>
                            <Button variant="link" asChild>
                                <Link href="/dashboard/marketplace">Explora el marketplace para empezar.</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="received">
             <Card>
                <CardHeader>
                    <CardTitle>Solicitudes Recibidas</CardTitle>
                    <CardDescription>Otros usuarios están interesados en tus residuos. ¡Respóndeles!</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                        <Handshake className="h-16 w-16 text-muted-foreground" />
                        <h3 className="mt-4 text-xl font-semibold">Aún no has recibido solicitudes</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Cuando un transformador solicite uno de tus residuos, aparecerá aquí.
                        </p>
                    </div>
                </CardContent>
             </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
