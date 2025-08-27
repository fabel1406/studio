// src/app/dashboard/negotiations/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, ArrowRight } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState } from "react";
import { getAllNegotiationsForUser } from "@/services/negotiation-service";
import type { Negotiation } from "@/lib/types";
import { useRole } from "../layout";


const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    REVIEWED: { text: 'En revisión', variant: 'secondary' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
}

export default function NegotiationsPage() {
  const { role } = useRole();
  const [sentNegotiations, setSentNegotiations] = useState<Negotiation[]>([]);
  const [receivedNegotiations, setReceivedNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock current user - this would come from an auth context
  // comp-1 is Generator, comp-3 is Transformer
  const currentUserId = role === 'GENERATOR' ? 'comp-1' : 'comp-3';

  useEffect(() => {
    const { sent, received } = getAllNegotiationsForUser(currentUserId);
    setSentNegotiations(sent);
    setReceivedNegotiations(received);
    setIsLoading(false);
  }, [currentUserId]);

  const renderNegotiationList = (negotiations: Negotiation[], type: 'sent' | 'received') => {
      if (isLoading) return <p>Cargando negociaciones...</p>;
      if (negotiations.length === 0) {
           return (
                <div className="text-center py-16 text-muted-foreground">
                    {type === 'sent' ? (
                        <>
                            <p>Aún no has enviado ninguna solicitud.</p>
                            <Button variant="link" asChild>
                                <Link href="/dashboard/marketplace">Explora el marketplace para empezar.</Link>
                            </Button>
                        </>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                            <Handshake className="h-16 w-16 text-muted-foreground" />
                            <h3 className="mt-4 text-xl font-semibold">Aún no has recibido solicitudes</h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Cuando un transformador solicite uno de tus residuos, aparecerá aquí.
                            </p>
                        </div>
                    )}
                </div>
           )
      }

      return negotiations.map((neg) => {
            if (!neg.residue) return null; // Defensive check
            return (
                <div key={neg.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-12 w-12 hidden md:flex">
                        <AvatarImage src={neg.residue.photos?.[0]} alt={neg.residue.type} />
                        <AvatarFallback>{neg.residue.type.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold text-lg">{neg.residue.type}</p>
                        <p className="text-sm text-muted-foreground">
                            {type === 'sent' 
                                ? <>Solicitud a <span className="text-primary font-medium">{neg.requester.name}</span></>
                                : <>Solicitud de <span className="text-primary font-medium">{neg.supplier.name}</span></>
                            }
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">{neg.quantity} {neg.unit}</p>
                        <p className="text-sm text-muted-foreground">Cantidad</p>
                    </div>
                        <div className="text-center">
                        <Badge variant={statusMap[neg.status].variant}>{statusMap[neg.status].text}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{format(new Date(neg.createdAt), "d MMM, yyyy", { locale: es })}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/negotiations/${neg.id}`}>
                            Ver Negociación <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            )
      });
  }


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
      
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="received">Solicitudes Recibidas</TabsTrigger>
          <TabsTrigger value="sent">Mis Solicitudes</TabsTrigger>
        </TabsList>
        <TabsContent value="received">
             <Card>
                <CardHeader>
                    <CardTitle>Solicitudes Recibidas</CardTitle>
                    <CardDescription>Otros usuarios están interesados en tus residuos. ¡Respóndeles!</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {renderNegotiationList(receivedNegotiations, 'received')}
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="sent">
            <Card>
                <CardHeader>
                    <CardTitle>Mis Ofertas Enviadas</CardTitle>
                    <CardDescription>Aquí están las ofertas que has enviado a los transformadores para cubrir sus necesidades.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {renderNegotiationList(sentNegotiations, 'sent')}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
