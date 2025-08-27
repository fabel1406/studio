// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage, Residue, Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';
import { getAllResidues } from './residue-service';


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
                residueId: residue.id, // ensure residueId is stored
            };
        });
        localStorage.setItem('negotiations', JSON.stringify(dataToStore));
    }
};


const rehydrateNegotiations = (negotiations: (Negotiation | {residueId: string})[]): Negotiation[] => {
    const allResidues = getAllResidues();
    return negotiations
        .map(neg => {
            if ('residue' in neg) {
                 return {
                    ...neg,
                    requester: mockCompanies.find(c => c.id === neg.requesterId),
                    supplier: mockCompanies.find(c => c.id === neg.supplierId),
                 } as Negotiation
            }
            const residue = allResidues.find(r => r.id === neg.residueId);
            if (!residue) return null;
            return {
                ...neg,
                residue,
                requester: mockCompanies.find(c => c.id === (neg as Negotiation).requesterId),
                supplier: mockCompanies.find(c => c.id === (neg as Negotiation).supplierId),
            } as Negotiation;
        })
        .filter((neg): neg is Negotiation => neg !== null);
};


// Initialize on first load if not present
if (typeof window !== 'undefined' && !localStorage.getItem('negotiations')) {
    setStoredNegotiations([]);
}

type NewNegotiationData = {
    residue: Residue;
    supplierId: string; 
    requesterId: string; 
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    
    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residue.id,
        residue: data.residue,
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
            senderId: data.supplierId,
            content: `He enviado una oferta de ${data.quantity} ${data.unit}.`,
            timestamp: new Date().toISOString()
        }],
    };
    
    setStoredNegotiations([...currentNegotiations, newNegotiation]);
    return newNegotiation;
};


export const getAllNegotiationsForUser = (userId: string): { sent: Negotiation[], received: Negotiation[] } => {
    const allNegotiations = rehydrateNegotiations(getStoredNegotiations());
    const sent = allNegotiations.filter(n => n.supplierId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const received = allNegotiations.filter(n => n.requesterId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { sent, received };
};

export const getNegotiationById = (id: string): Negotiation | undefined => {
    return rehydrateNegotiations(getStoredNegotiations()).find(n => n.id === id);
};

export const updateNegotiationStatus = (id: string, status: Negotiation['status']): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    currentNegotiations[index].status = status;
    setStoredNegotiations(currentNegotiations);
    return rehydrateNegotiations([currentNegotiations[index]])[0];
};

export const updateNegotiationDetails = (id: string, quantity: number, price?: number): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");

    const originalQuantity = currentNegotiations[index].quantity;
    const originalPrice = currentNegotiations[index].offerPrice;

    currentNegotiations[index].quantity = quantity;
    currentNegotiations[index].offerPrice = price;

    let messageContent = "He modificado la oferta.";
    if (quantity !== originalQuantity) {
        messageContent += ` Nueva cantidad: ${quantity} ${currentNegotiations[index].unit}.`
    }
     if (price !== originalPrice) {
        messageContent += ` Nuevo precio: ${price !== undefined ? `$${price}` : 'Negociable'}.`
    }

    currentNegotiations[index].messages.push({
        senderId: currentNegotiations[index].supplierId,
        content: messageContent,
        timestamp: new Date().toISOString(),
    });

    setStoredNegotiations(currentNegotiations);
    return rehydrateNegotiations([currentNegotiations[index]])[0];
};


export const addMessageToNegotiation = (id: string, message: NegotiationMessage): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);
    if (index === -1) throw new Error("Negotiation not found");
    
    currentNegotiations[index].messages.push(message);
    setStoredNegotiations(currentNegotiations);
    return rehydrateNegotiations([currentNegotiations[index]])[0];
}

export const deleteNegotiation = (id: string): void => {
    const currentNegotiations = getStoredNegotiations();
    const updatedNegotiations = currentNegotiations.filter(n => n.id !== id);
    setStoredNegotiations(updatedNegotiations);
};
