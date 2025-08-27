// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage } from '@/lib/types';
import { mockCompanies } from '@/lib/data';
import { getResidueById } from './residue-service';

// Treat this as an in-memory database for negotiations
let negotiationsDB: Negotiation[] = [];

const rehydrateNegotiation = (negotiation: Negotiation): Negotiation => {
    return {
        ...negotiation,
        residue: getResidueById(negotiation.residueId)!,
        requester: mockCompanies.find(c => c.id === negotiation.requesterId),
        supplier: mockCompanies.find(c => c.id === negotiation.supplierId),
    };
};

type NewNegotiationData = {
    residueId: string;
    supplierId: string; 
    requesterId: string; 
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const residue = getResidueById(data.residueId);
    if (!residue) throw new Error("Residue not found for negotiation");
    
    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residueId,
        residue: residue,
        supplierId: data.supplierId,
        requesterId: data.requesterId,
        quantity: data.quantity,
        unit: data.unit,
        offerPrice: data.offerPrice,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        messages: [{
            senderId: data.supplierId,
            content: `He enviado una oferta de ${data.quantity} ${data.unit}${data.offerPrice ? ` a $${data.offerPrice}/${data.unit}` : ''}.`,
            timestamp: new Date().toISOString()
        }],
    };
    
    negotiationsDB.push(newNegotiation);
    return rehydrateNegotiation(newNegotiation);
};

export const getAllNegotiationsForUser = (userId: string): { sentOffers: Negotiation[], receivedOffers: Negotiation[] } => {
    const allNegotiations = negotiationsDB.map(rehydrateNegotiation);
    
    // As a GENERATOR (or BOTH), you send offers.
    const sentOffers = allNegotiations
      .filter(n => n.supplierId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    // As a TRANSFORMER (or BOTH), you receive offers.
    const receivedOffers = allNegotiations
      .filter(n => n.requesterId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    return { sentOffers, receivedOffers };
};

export const getNegotiationById = (id: string): Negotiation | undefined => {
    const negotiation = negotiationsDB.find(n => n.id === id);
    return negotiation ? rehydrateNegotiation(negotiation) : undefined;
};

export const updateNegotiationStatus = (id: string, status: Negotiation['status']): Negotiation => {
    const index = negotiationsDB.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    negotiationsDB[index].status = status;
    return rehydrateNegotiation(negotiationsDB[index]);
};

export const updateNegotiationDetails = (id: string, quantity: number, price?: number): Negotiation => {
    const index = negotiationsDB.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    const negotiationToUpdate = negotiationsDB[index];

    const originalQuantity = negotiationToUpdate.quantity;
    const originalPrice = negotiationToUpdate.offerPrice;

    negotiationToUpdate.quantity = quantity;
    negotiationToUpdate.offerPrice = price;

    let messageContent = "He modificado la oferta.";
    if (quantity !== originalQuantity) {
        messageContent += ` Nueva cantidad: ${quantity} ${negotiationToUpdate.unit}.`
    }
     if (price !== originalPrice) {
        messageContent += ` Nuevo precio: ${price !== undefined ? `$${price}` : 'Negociable'}.`
    }

    negotiationToUpdate.messages.push({
        senderId: negotiationToUpdate.supplierId,
        content: messageContent,
        timestamp: new Date().toISOString(),
    });

    return rehydrateNegotiation(negotiationToUpdate);
};

export const addMessageToNegotiation = (id: string, message: NegotiationMessage): Negotiation => {
    const index = negotiationsDB.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");
    
    negotiationsDB[index].messages.push(message);
    return rehydrateNegotiation(negotiationsDB[index]);
}

export const deleteNegotiation = (id: string): void => {
    negotiationsDB = negotiationsDB.filter(n => n.id !== id);
};
