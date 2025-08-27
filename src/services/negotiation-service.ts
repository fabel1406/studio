// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage } from '@/lib/types';
import { mockCompanies } from '@/lib/data';
import { getResidueById } from './residue-service';

// In-memory array to act as a database
let negotiationsDB: Negotiation[] = [];

/**
 * Attaches full company and residue objects to a raw negotiation object.
 * This is crucial for displaying details in the UI.
 * @param negotiation The raw negotiation object.
 * @returns The rehydrated negotiation object with full details.
 */
const rehydrateNegotiation = (negotiation: Negotiation): Negotiation => {
    const residue = getResidueById(negotiation.residueId);
    
    // Create a placeholder for deleted residues to avoid crashes.
    const hydratedResidue = residue || {
        id: negotiation.residueId,
        type: 'Residuo eliminado',
        category: 'OTHERS',
        quantity: 0,
        unit: 'KG',
        status: 'CLOSED',
        companyId: negotiation.supplierId,
        availabilityDate: new Date().toISOString(),
    };
    
    return {
        ...negotiation,
        residue: hydratedResidue,
        requester: mockCompanies.find(c => c.id === negotiation.requesterId),
        supplier: mockCompanies.find(c => c.id === negotiation.supplierId),
    };
};

type NewNegotiationData = {
    residueId: string;
    requesterId: string; // The one initiating the contact
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const residue = getResidueById(data.residueId);
    if (!residue || !residue.companyId) {
        throw new Error("Residue or its company ID not found for negotiation");
    }

    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residueId,
        residue: residue, // Storing the full object at creation time
        supplierId: residue.companyId, // The supplier is the owner of the residue
        requesterId: data.requesterId,
        quantity: data.quantity,
        unit: data.unit,
        offerPrice: data.offerPrice,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        messages: [{
            senderId: data.requesterId, 
            content: `He iniciado una negociación por ${data.quantity} ${data.unit} de ${residue.type}.`,
            timestamp: new Date().toISOString()
        }],
    };
    
    negotiationsDB.push(newNegotiation);
    return rehydrateNegotiation(newNegotiation);
};


export const getAllNegotiationsForUser = (userId: string): { sent: Negotiation[], received: Negotiation[] } => {
    const allNegotiations = negotiationsDB.map(rehydrateNegotiation);
    
    // "Sent" are negotiations the user initiated.
    const sent = allNegotiations
      .filter(n => n.requesterId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    // "Received" are negotiations where the user is the recipient of the request.
    const received = allNegotiations
      .filter(n => n.supplierId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    return { sent, received };
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
    const negotiationToUpdate = negotiationsDB.find(n => n.id === id);
    if (!negotiationToUpdate) throw new Error("Negotiation not found");

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
