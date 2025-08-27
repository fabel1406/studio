// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage, Residue, Company } from '@/lib/types';
import { mockCompanies, mockResidues } from '@/lib/data';
import { getResidueById, getAllResidues } from './residue-service';


const getStoredNegotiations = (): Negotiation[] => {
    if (typeof window === 'undefined') {
        return []; // Server-side fallback
    }
    try {
        const storedData = localStorage.getItem('negotiations');
        return storedData ? JSON.parse(storedData) as Negotiation[] : [];
    } catch (e) {
        console.error("Failed to parse negotiations from localStorage", e);
        return [];
    }
};

const setStoredNegotiations = (negotiations: Negotiation[]): void => {
    if (typeof window !== 'undefined') {
         // To avoid storing redundant nested data, just store the IDs.
        const dataToStore = negotiations.map(neg => {
            const { residue, requester, supplier, ...rest } = neg;
            return {
                ...rest,
                residueId: neg.residueId,
            };
        });
        localStorage.setItem('negotiations', JSON.stringify(dataToStore));
    }
};


const rehydrateNegotiations = (negotiations: (Omit<Negotiation, 'residue' | 'requester' | 'supplier'>)[]): Negotiation[] => {
    return negotiations
        .map(neg => {
            const residue = getResidueById(neg.residueId);
            if (!residue) return null;
            
            return {
                ...neg,
                residue,
                requester: mockCompanies.find(c => c.id === neg.requesterId),
                supplier: mockCompanies.find(c => c.id === neg.supplierId),
            } as Negotiation;
        })
        .filter((neg): neg is Negotiation => neg !== null);
};


// Initialize on first load if not present
if (typeof window !== 'undefined' && !localStorage.getItem('negotiations')) {
    setStoredNegotiations([]);
}

type NewNegotiationData = {
    residueId: string;
    supplierId: string; 
    requesterId: string; 
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const residue = getResidueById(data.residueId);
    if (!residue) throw new Error("Residue not found for negotiation");
    
    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residueId,
        residue: residue,
        supplierId: data.supplierId,
        supplier: mockCompanies.find(c => c.id === data.supplierId),
        requesterId: data.requesterId,
        requester: mockCompanies.find(c => c.id === data.requesterId),
        quantity: data.quantity,
        unit: data.unit,
        offerPrice: data.offerPrice,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        messages: [{
            senderId: data.supplierId, // The one making the offer starts the chat
            content: `He enviado una oferta de ${data.quantity} ${data.unit}.`,
            timestamp: new Date().toISOString()
        }],
    };
    
    setStoredNegotiations([...rehydrateNegotiations(currentNegotiations), newNegotiation]);
    return newNegotiation;
};


export const getAllNegotiationsForUser = (userId: string): { sentOffers: Negotiation[], receivedOffers: Negotiation[] } => {
    const allNegotiations = rehydrateNegotiations(getStoredNegotiations());
    // Sent offers are those where the user is the supplier (Generator)
    const sentOffers = allNegotiations.filter(n => n.supplierId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Received offers are those where the user is the requester (Transformer)
    const receivedOffers = allNegotiations.filter(n => n.requesterId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { sentOffers, receivedOffers };
};

export const getNegotiationById = (id: string): Negotiation | undefined => {
    return rehydrateNegotiations(getStoredNegotiations()).find(n => n.id === id);
};

export const updateNegotiationStatus = (id: string, status: Negotiation['status']): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    currentNegotiations[index].status = status;
    setStoredNegotiations(rehydrateNegotiations(currentNegotiations));
    return rehydrateNegotiations([currentNegotiations[index]])[0];
};

export const updateNegotiationDetails = (id: string, quantity: number, price?: number): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    const hydratedNegotiations = rehydrateNegotiations(currentNegotiations);
    const negotiationToUpdate = hydratedNegotiations.find(n => n.id === id)!;

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

    setStoredNegotiations(hydratedNegotiations);
    return negotiationToUpdate;
};


export const addMessageToNegotiation = (id: string, message: NegotiationMessage): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");
    
    const hydratedNegotiations = rehydrateNegotiations(currentNegotiations);
    const negotiationToUpdate = hydratedNegotiations.find(n => n.id === id)!;
    negotiationToUpdate.messages.push(message);

    setStoredNegotiations(hydratedNegotiations);
    return negotiationToUpdate;
}

export const deleteNegotiation = (id: string): void => {
    const currentNegotiations = getStoredNegotiations();
    const updatedNegotiations = currentNegotiations.filter(n => n.id !== id);
    setStoredNegotiations(rehydrateNegotiations(updatedNegotiations));
};
