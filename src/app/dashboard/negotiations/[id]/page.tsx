// src/app/dashboard/negotiations/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { getNegotiationById, updateNegotiationStatus, addMessageToNegotiation, updateNegotiationDetails } from "@/services/negotiation-service";
import { useRole } from "../../role-provider";
import type { Negotiation, NegotiationMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Pencil, XCircle, CheckCircle, DollarSign, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NegotiationChat } from "@/components/negotiation-chat";
import { OfferDialog } from "@/components/offer-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
};

export default function NegotiationDetailPage() {
    const params = useParams();
    const id = typeof params?.id === 'string' ? params.id : '';
    const router = useRouter();
    const { companyId } = useRole();
    const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditOfferOpen, setIsEditOfferOpen] = useState(false);

    const fetchNegotiation = useCallback(async () => {
        if (id) {
            const fetchedNegotiation = await getNegotiationById(id);
            if (fetchedNegotiation) {
                setNegotiation(fetchedNegotiation);
            } else {
                notFound();
            }
        }
    }, [id]);


    useEffect(() => {
        setIsLoading(true);
        fetchNegotiation().finally(() => setIsLoading(false));
    }, [fetchNegotiation]);

    const handleUpdateStatus = async (status: Negotiation['status']) => {
        if (!negotiation) return;
        await updateNegotiationStatus(negotiation.id, status);
        await fetchNegotiation();
    };

    const handleSendMessage = async (content: string) => {
        if (!negotiation || !companyId) return;

        // Optimistic UI update
        const optimisticMessage: NegotiationMessage = {
            id: `temp-${Date.now()}`,
            negotiationId: negotiation.id,
            senderId: companyId,
            content,
            createdAt: new Date().toISOString(), // Use client time for immediate display
        };
        
        setNegotiation(prev => {
            if (!prev) return null;
            return { ...prev, messages: [...prev.messages, optimisticMessage] }
        });

        try {
            await addMessageToNegotiation(negotiation.id, companyId, content);
            await fetchNegotiation(); // Re-fetch to sync with server, replacing the optimistic message
        } catch (error) {
            console.error("Failed to send message, reverting optimistic update");
            await fetchNegotiation(); 
        }
    };
    
    const handleOfferUpdated = async (quantity: number, price?: number) => {
        if (!negotiation) return;
        const updatedNegotiation = await updateNegotiationDetails(negotiation.id, quantity, price);
        if (updatedNegotiation) {
            setNegotiation(updatedNegotiation);
        }
    }

    if (isLoading || !companyId) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!negotiation) {
        return notFound();
    }
    
    const isInitiator = negotiation.initiatedBy === companyId;
    const isRecipient = !isInitiator;
    const canAcceptOrReject = isRecipient;
    const canModifyOrCancel = isInitiator;
    const isActionable = negotiation.status === 'SENT';
    const otherParty = companyId === negotiation.requesterId ? negotiation.supplier : negotiation.requester;
    const otherPartyRole = companyId === negotiation.requesterId ? 'Proveedor' : 'Solicitante';


    return (
        <>
            <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Volver a Negociaciones
                </Button>
                
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles de la Negociación</CardTitle>
                                <div className="flex items-center gap-4 pt-2">
                                    <Badge variant={statusMap[negotiation.status].variant}>{statusMap[negotiation.status].text}</Badge>
                                    <span className="text-sm text-muted-foreground">
                                        Iniciada el {format(new Date(negotiation.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground mb-2">Residuo</h3>
                                        <p className="font-bold text-primary text-lg">{negotiation.residue.type}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-muted-foreground mb-2">Cantidad</h3>
                                        <p className="font-bold text-lg">{negotiation.quantity} {negotiation.unit}</p>
                                    </div>
                                    {negotiation.offerPrice !== undefined && (
                                        <div>
                                            <h3 className="font-semibold text-muted-foreground mb-2">Precio Ofertado</h3>
                                             <p className="font-bold text-lg flex items-center gap-1">
                                                <DollarSign className="h-5 w-5"/>
                                                {negotiation.offerPrice.toFixed(2)} / {negotiation.unit}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <NegotiationChat
                            messages={negotiation.messages}
                            onSendMessage={handleSendMessage}
                            companyId={companyId}
                        />
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{otherPartyRole}</CardTitle>
                            </CardHeader>
                             <CardContent className="flex items-center gap-4">
                                {otherParty ? (
                                    <>
                                        <Avatar className="h-12 w-12">
                                            <AvatarFallback>{otherParty.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{otherParty.name}</p>
                                            <p className="text-sm text-muted-foreground">{otherParty.city}</p>
                                        </div>
                                    </>
                                ) : (
                                     <p className="text-sm text-muted-foreground">No se encontró la información de la empresa.</p>
                                )}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {isActionable ? (
                                    <>
                                        {canAcceptOrReject && (
                                            <>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button className="w-full">
                                                            <CheckCircle className="mr-2 h-4 w-4" /> Aceptar
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                        <AlertDialogTitle>¿Estás seguro de que quieres aceptar esta oferta?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Esta acción no se puede deshacer. Al aceptar, se cerrará la negociación y se notificará a la otra parte.
                                                        </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                            <AlertDialogAction onClick={() => handleUpdateStatus('ACCEPTED')}>Aceptar</AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>

                                                <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Rechazar
                                                </Button>
                                            </>
                                        )}
                                        {canModifyOrCancel && ( 
                                            <>
                                                <Button className="w-full" variant="outline" onClick={() => setIsEditOfferOpen(true)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Modificar
                                                </Button>
                                                <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancelar
                                                </Button>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {negotiation.status === 'ACCEPTED' && <p className="text-center text-green-600 font-semibold">¡Negociación Aceptada!</p>}
                                        {negotiation.status === 'REJECTED' && <p className="text-center text-red-600 font-semibold">Negociación Rechazada/Cancelada</p>}
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {isInitiator && (
                <OfferDialog
                    isOpen={isEditOfferOpen}
                    onOpenChange={setIsEditOfferOpen}
                    negotiationToEdit={negotiation}
                    onOfferUpdated={handleOfferUpdated}
                />
            )}
        </>
    );
}