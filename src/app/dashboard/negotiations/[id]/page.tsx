
// src/app/dashboard/negotiations/[id]/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { getNegotiationById, updateNegotiationStatus, addMessageToNegotiation } from "@/services/negotiation-service";
import { useRole } from "../../layout";
import type { Negotiation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Pencil, XCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NegotiationChat } from "@/components/negotiation-chat";
import { OfferDialog } from "@/components/offer-dialog";


const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
};

export default function NegotiationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { role, currentUserId } = useRole();
    const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditOfferOpen, setIsEditOfferOpen] = useState(false);

    useEffect(() => {
        if (id) {
            const fetchedNegotiation = getNegotiationById(id);
            setNegotiation(fetchedNegotiation || null);
            setIsLoading(false);
        }
    }, [id]);

    const handleUpdateStatus = (status: Negotiation['status']) => {
        if (!negotiation) return;
        const updatedNegotiation = updateNegotiationStatus(negotiation.id, status);
        setNegotiation(updatedNegotiation);
    };

    const handleSendMessage = (content: string) => {
        if (!negotiation || !currentUserId) return;
        const updatedNegotiation = addMessageToNegotiation(negotiation.id, {
            senderId: currentUserId,
            content,
            timestamp: new Date().toISOString(),
        });
        setNegotiation(updatedNegotiation);
    };
    
    const handleOfferUpdated = (updatedNegotiation: Negotiation) => {
        setNegotiation(updatedNegotiation);
    }

    if (isLoading || !currentUserId) {
        return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">Cargando...</div>;
    }

    if (!negotiation) {
        return notFound();
    }
    
    // The user is the supplier if their ID matches the supplierId in the negotiation.
    const isSupplier = negotiation.supplierId === currentUserId;
    // The user is the one who initiated the negotiation if their ID matches the requesterId.
    const isRequester = negotiation.requesterId === currentUserId;

    // The negotiation is actionable if it's in 'SENT' state.
    const isActionable = negotiation.status === 'SENT';

    // The user who can accept/reject is the one who DID NOT initiate the negotiation (the recipient).
    const canAcceptOrReject = !isRequester;

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
                                        <h3 className="font-semibold text-muted-foreground mb-2">Cantidad Ofertada</h3>
                                        <p className="font-bold text-lg">{negotiation.quantity} {negotiation.unit}</p>
                                    </div>
                                    {negotiation.offerPrice !== undefined && (
                                        <div>
                                            <h3 className="font-semibold text-muted-foreground mb-2">Precio de la Oferta</h3>
                                            <p className="font-bold text-lg">${negotiation.offerPrice} / {negotiation.unit}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <NegotiationChat
                            messages={negotiation.messages}
                            onSendMessage={handleSendMessage}
                            currentUserId={currentUserId}
                        />
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{isRequester ? 'Proveedor' : 'Solicitante'}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarFallback>{isRequester ? negotiation.supplier.name.charAt(0) : negotiation.requester.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{isRequester ? negotiation.supplier.name : negotiation.requester.name}</p>
                                    <p className="text-sm text-muted-foreground">{isRequester ? negotiation.supplier.city : negotiation.requester.city}</p>
                                </div>
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
                                                <Button className="w-full" onClick={() => handleUpdateStatus('ACCEPTED')}>
                                                    <CheckCircle className="mr-2 h-4 w-4" /> Aceptar Oferta
                                                </Button>
                                                <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Rechazar Oferta
                                                </Button>
                                            </>
                                        )}
                                        {isRequester && ( 
                                            <>
                                                <Button className="w-full" variant="outline" onClick={() => setIsEditOfferOpen(true)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Modificar Solicitud
                                                </Button>
                                                <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>
                                                    <XCircle className="mr-2 h-4 w-4" /> Cancelar Solicitud
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

            {isRequester && (
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
