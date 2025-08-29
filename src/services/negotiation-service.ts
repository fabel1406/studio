// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage, Residue, Need } from '@/lib/types';
import { mockCompanies } from '@/lib/data';
import { getResidueById } from './residue-service';

// In-memory array to act as a database
let negotiationsDB: Negotiation[] = [];


const rehydrateNegotiation = (negotiation: Negotiation): Negotiation => {
    const residue = getResidueById(negotiation.residueId);
    
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

type NewNegotiationFromResidue = {
    type: 'request';
    residue: Residue;
    initiatorId: string; // Transformer's ID
    quantity: number;
}

type NewNegotiationFromNeed = {
    type: 'offer';
    residue: Residue;
    need: Need;
    initiatorId: string; // Generator's ID
    quantity: number;
    offerPrice?: number;
}

const checkExistingNegotiation = (requesterId: string, supplierId: string, residueId: string): boolean => {
    return negotiationsDB.some(n => 
        n.requesterId === requesterId &&
        n.supplierId === supplierId &&
        n.residueId === residueId &&
        n.status === 'SENT'
    );
};

export const addNegotiation = (data: NewNegotiationFromResidue | NewNegotiationFromNeed): Negotiation | null => {
    let newNegotiation: Negotiation;
    let requesterId: string, supplierId: string, residueId: string;

    if (data.type === 'request') {
        requesterId = data.initiatorId;
        supplierId = data.residue.companyId;
        residueId = data.residue.id;
    } else { // type === 'offer'
        requesterId = data.need.companyId;
        supplierId = data.initiatorId;
        residueId = data.residue.id;
    }

    if (checkExistingNegotiation(requesterId, supplierId, residueId)) {
        console.warn("Attempted to create a duplicate negotiation.");
        return null; // Or throw an error
    }

    if (data.type === 'request') {
        newNegotiation = {
            id: `neg-${Date.now()}`,
            residueId: data.residue.id,
            requesterId: data.initiatorId, // The Transformer is the requester
            supplierId: data.residue.companyId, // The Generator is the supplier
            quantity: data.quantity,
            unit: data.residue.unit,
            initiatedBy: data.initiatorId,
            status: 'SENT',
            createdAt: new Date().toISOString(),
            messages: [{
                senderId: data.initiatorId,
                content: `Ha solicitado ${data.quantity} ${data.residue.unit} de ${data.residue.type}.`,
                timestamp: new Date().toISOString()
            }],
        };
    } else { // type === 'offer'
        newNegotiation = {
            id: `neg-${Date.now()}`,
            residueId: data.residue.id,
            requesterId: data.need.companyId, // The Transformer who created the need is the requester
            supplierId: data.initiatorId, // The Generator making the offer is the supplier
            quantity: data.quantity,
            unit: data.residue.unit,
            offerPrice: data.offerPrice,
            initiatedBy: data.initiatorId,
            status: 'SENT',
            createdAt: new Date().toISOString(),
            messages: [{
                senderId: data.initiatorId,
                content: `Ha ofrecido ${data.quantity} ${data.residue.unit} de ${data.residue.type}${data.offerPrice ? ` a $${data.offerPrice}/${data.residue.unit}`: ''} para cubrir tu necesidad.`,
                timestamp: new Date().toISOString()
            }],
        };
    }
    
    negotiationsDB.push(newNegotiation);
    return rehydrateNegotiation(newNegotiation);
};


export const getAllNegotiationsForUser = (userId: string): { sent: Negotiation[], received: Negotiation[] } => {
    const allNegotiations = negotiationsDB.map(rehydrateNegotiation);
    
    // "Sent" are negotiations the user initiated.
    const sent = allNegotiations
      .filter(n => n.initiatedBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    // "Received" are negotiations initiated by the other party.
    const received = allNegotiations
      .filter(n => n.initiatedBy !== userId && (n.requesterId === userId || n.supplierId === userId))
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
        senderId: negotiationToUpdate.initiatedBy,
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
