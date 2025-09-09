
// src/app/dashboard/negotiations/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Handshake, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useEffect, useState, useCallback } from "react";
import { getAllNegotiationsForUser, hideNegotiationForUser } from "@/services/negotiation-service";
import type { Negotiation } from "@/lib/types";
import { useRole } from "../role-provider";
import { useToast } from "@/hooks/use-toast";


const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
};

export default function NegotiationsPage() {
  const { role, companyId } = useRole();
  const { toast } = useToast();
  const [sentNegotiations, setSentNegotiations] = useState<Negotiation[]>([]);
  const [receivedNegotiations, setReceivedNegotiations] = useState<Negotiation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const fetchNegotiations = useCallback(async () => {
    if (!companyId) {
        setIsLoading(false);
        return;
    };
    setIsLoading(true);
    try {
        const { sent, received } = await getAllNegotiationsForUser(companyId);
        setSentNegotiations(sent);
        setReceivedNegotiations(received);
    } catch (error) {
        console.error("Failed to fetch negotiations:", error);
        toast({
            title: "Error",
            description: "No se pudieron cargar las negociaciones.",
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }, [companyId, toast]);

  useEffect(() => {
    fetchNegotiations();
  }, [fetchNegotiations]);

  const handleHideNegotiation = async (id: string) => {
    if (!companyId) return;
    await hideNegotiationForUser(id, companyId);
    await fetchNegotiations(); // Re-fetch to update the list
    toast({
        title: "Negociación Ocultada",
        description: "La negociación ha sido eliminada de tu historial."
    });
  }

  const renderNegotiationList = (negotiations: Negotiation[], listType: 'sent' | 'received') => {
      if (!companyId) return null;

      if (isLoading) return <p>Cargando negociaciones...</p>;
      
      const isEmpty = negotiations.length === 0;

      if (isEmpty) {
           return (
                <div className="text-center py-16 text-muted-foreground">
                    <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
                         <Handshake className="h-16 w-16 text-muted-foreground" />
                         <h3 className="mt-4 text-xl font-semibold">No hay negociaciones aquí</h3>
                          {listType === 'sent' && <p className="mt-2 text-sm text-muted-foreground">Cuando envíes una oferta o solicitud, aparecerá aquí.</p>}
                          {listType === 'received' && <p className="mt-2 text-sm text-muted-foreground">Cuando recibas una oferta o solicitud, aparecerá aquí.</p>}
                         <Button variant="link" asChild className="mt-2">
                            <Link href="/dashboard/marketplace">Explora el marketplace para empezar.</Link>
                        </Button>
                    </div>
                </div>
           )
      }

      return negotiations.map((neg) => {
            const otherParty = neg.requesterId === companyId ? neg.supplier : neg.requester;
            const isRejected = neg.status === 'REJECTED';
            const statusInfo = statusMap[neg.status];

            if (!otherParty || !statusInfo) return null;

            return (
                <div key={neg.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-12 w-12 hidden md:flex">
                        <AvatarImage src={neg.residue.photos?.[0]} alt={neg.residue.type} />
                        <AvatarFallback>{neg.residue.type.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-grow">
                        <p className="font-semibold text-lg">{neg.residue.type}</p>
                         <p className="text-sm text-muted-foreground">
                            {listType === 'sent' 
                                ? <>Para <span className="text-primary font-medium">{otherParty.name}</span></>
                                : <>De <span className="text-primary font-medium">{otherParty.name}</span></>
                            }
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-lg">{neg.quantity} {neg.unit}</p>
                        <p className="text-sm text-muted-foreground">Cantidad</p>
                    </div>
                    {neg.offerPrice !== undefined && neg.offerPrice !== null && (
                        <div className="text-center">
                            <p className="font-bold text-lg">${neg.offerPrice.toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">Precio/{neg.unit}</p>
                        </div>
                    )}
                        <div className="text-center">
                        <Badge variant={statusInfo.variant}>{statusInfo.text}</Badge>
                        <p className="text-sm text-muted-foreground mt-2">{format(new Date(neg.createdAt), "d MMM, yyyy", { locale: es })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/negotiations/${neg.id}`}>
                                Ver Negociación <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        {isRejected && (
                             <Button variant="ghost" size="icon" onClick={() => handleHideNegotiation(neg.id)} title="Ocultar negociación">
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            )
      });
  }
  
  const TABS_CONFIG = {
    GENERATOR: {
      received: {
        value: "received",
        label: "Solicitudes Recibidas",
        title: "Solicitudes de Transformadores",
        description: "Empresas interesadas en tus residuos. ¡Respóndeles!",
      },
      sent: {
        value: "sent",
        label: "Mis Ofertas Enviadas",
        title: "Ofertas Enviadas a Transformadores",
        description: "Estas son las ofertas que has enviado para cubrir las necesidades de los transformadores.",
      },
    },
    TRANSFORMER: {
      received: {
        value: "received",
        label: "Ofertas Recibidas",
        title: "Ofertas de Generadores",
        description: "Generadores han ofertado sus residuos para cubrir tus necesidades.",
      },
      sent: {
        value: "sent",
        label: "Mis Solicitudes Enviadas",
        title: "Solicitudes a Generadores",
        description: "Aquí están las solicitudes que has iniciado para adquirir residuos.",
      },
    },
    BOTH: {
      received: {
        value: "received",
        label: "Negociaciones Recibidas",
        title: "Solicitudes y Ofertas Recibidas",
        description: "Aquí están todas las negociaciones iniciadas por otros usuarios hacia ti.",
      },
      sent: {
        value: "sent",
        label: "Negociaciones Enviadas",
        title: "Mis Ofertas y Solicitudes Enviadas",
        description: "Aquí están todas las negociaciones que has iniciado.",
      },
    }
  };
  
  const currentTabs = role ? TABS_CONFIG[role] : TABS_CONFIG.GENERATOR;
  const defaultTab = currentTabs.received.value;

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
      
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value={currentTabs.received.value}>{currentTabs.received.label}</TabsTrigger>
          <TabsTrigger value={currentTabs.sent.value}>{currentTabs.sent.label}</TabsTrigger>
        </TabsList>
        <TabsContent value={currentTabs.received.value}>
             <Card>
                <CardHeader>
                    <CardTitle>{currentTabs.received.title}</CardTitle>
                    <CardDescription>{currentTabs.received.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   {renderNegotiationList(receivedNegotiations, 'received')}
                </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value={currentTabs.sent.value}>
            <Card>
                <CardHeader>
                    <CardTitle>{currentTabs.sent.title}</CardTitle>
                    <CardDescription>{currentTabs.sent.description}</CardDescription>
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