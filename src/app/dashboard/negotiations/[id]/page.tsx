
// src/app/dashboard/negotiations/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import { getNegotiationById, updateNegotiationStatus, addMessageToNegotiation } from "@/services/negotiation-service";
import { useRole } from "../../layout";
import type { Negotiation } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Pencil, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NegotiationChat } from "@/components/negotiation-chat";


const statusMap: {[key: string]: {text: string, variant: 'default' | 'secondary' | 'outline' | 'destructive'}} = {
    SENT: { text: 'Enviado', variant: 'outline' },
    REVIEWED: { text: 'En revisión', variant: 'secondary' },
    ACCEPTED: { text: 'Aceptado', variant: 'default' },
    REJECTED: { text: 'Rechazado', variant: 'destructive' },
};

export default function NegotiationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { role } = useRole();
    const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Mocking user IDs based on role
    const currentUserId = role === 'GENERATOR' ? 'comp-1' : 'comp-3';

    useEffect(() => {
        if (id && role) {
            const fetchedNegotiation = getNegotiationById(id);
            // Simulate marking as reviewed if the requester views it
            if (fetchedNegotiation && fetchedNegotiation.status === 'SENT' && fetchedNegotiation.requesterId === currentUserId) {
                const updated = updateNegotiationStatus(fetchedNegotiation.id, 'REVIEWED');
                setNegotiation(updated);
            } else {
                setNegotiation(fetchedNegotiation || null);
            }
            setIsLoading(false);
        }
    }, [id, role, currentUserId]);

    const handleUpdateStatus = (status: Negotiation['status']) => {
        if (!negotiation) return;
        const updatedNegotiation = updateNegotiationStatus(negotiation.id, status);
        setNegotiation(updatedNegotiation);
    };

    const handleSendMessage = (content: string) => {
        if (!negotiation) return;
        const updatedNegotiation = addMessageToNegotiation(negotiation.id, {
            senderId: currentUserId,
            content,
            timestamp: new Date().toISOString(),
        });
        setNegotiation(updatedNegotiation);
    };

    if (isLoading) {
        return <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">Cargando...</div>;
    }

    if (!negotiation) {
        return notFound();
    }
    
    const isSupplier = negotiation.supplierId === currentUserId;
    const isRequester = negotiation.requesterId === currentUserId;
    const isActionable = negotiation.status === 'SENT' || negotiation.status === 'REVIEWED';

    return (
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
                            <CardTitle>{isSupplier ? 'Solicitante' : 'Proveedor'}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-4">
                            <Avatar className="h-12 w-12">
                                <AvatarFallback>{isSupplier ? negotiation.requester.name.charAt(0) : negotiation.supplier.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold">{isSupplier ? negotiation.requester.name : negotiation.supplier.name}</p>
                                <p className="text-sm text-muted-foreground">{isSupplier ? negotiation.requester.city : negotiation.supplier.city}</p>
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
                                    {isRequester && ( // Actions for the Transformer
                                        <>
                                            <Button className="w-full" onClick={() => handleUpdateStatus('ACCEPTED')}>Aceptar Oferta</Button>
                                            <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>Rechazar Oferta</Button>
                                        </>
                                    )}
                                    {isSupplier && ( // Actions for the Generator
                                        <>
                                            <Button className="w-full" variant="outline" disabled>
                                                <Pencil className="mr-2 h-4 w-4" /> Modificar Oferta (Próximamente)
                                            </Button>
                                            <Button className="w-full" variant="destructive" onClick={() => handleUpdateStatus('REJECTED')}>
                                                <XCircle className="mr-2 h-4 w-4" /> Cancelar Oferta
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
    );
}
