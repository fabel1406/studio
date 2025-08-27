// src/services/negotiation-service.ts
import type { Negotiation, Residue, Company, NegotiationMessage } from '@/lib/types';
import { mockResidues, mockCompanies, mockNeeds } from '@/lib/data';

const getStoredNegotiations = (): Negotiation[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    const storedData = localStorage.getItem('negotiations');
    if (storedData) {
        const negotiations: Negotiation[] = JSON.parse(storedData);
        // Re-hydrate the objects with full details from mock data
        return negotiations.map(neg => ({
            ...neg,
            residue: mockResidues.find(r => r.id === neg.residueId)!,
            requester: mockCompanies.find(c => c.id === neg.requesterId)!,
            supplier: mockCompanies.find(c => c.id === neg.supplierId)!,
        }));
    }
    return [];
};

const setStoredNegotiations = (negotiations: Negotiation[]): void => {
    if (typeof window !== 'undefined') {
        // We only store IDs, not the full objects
        const dataToStore = negotiations.map(({ residue, requester, supplier, ...rest }) => rest);
        localStorage.setItem('negotiations', JSON.stringify(dataToStore));
    }
};

if (typeof window !== 'undefined' && !localStorage.getItem('negotiations')) {
    setStoredNegotiations([]);
}

// --- Service Functions ---

type NewNegotiationData = {
    needId: string;
    residueId: string; // The actual residue being offered by the generator
    supplierId: string; // The generator's company ID
    requesterId: string; // The transformer's company ID (who created the need)
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const currentNegotiations = getStoredNegotiations();

    const need = mockNeeds.find(n => n.id === data.needId);
    const residue = mockResidues.find(r => r.id === data.residueId);
    const supplier = mockCompanies.find(c => c.id === data.supplierId);
    const requester = mockCompanies.find(c => c.id === data.requesterId);

    if (!need || !supplier || !requester || !residue) {
        throw new Error("Invalid data provided for negotiation.");
    }
    
    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residueId,
        supplierId: data.supplierId,
        requesterId: data.requesterId,
        quantity: data.quantity,
        unit: data.unit,
        offerPrice: data.offerPrice,
        residue: residue, // The specific residue being offered
        supplier: supplier,
        requester: requester,
        status: 'SENT',
        createdAt: new Date().toISOString(),
        messages: [],
    };
    
    const updatedNegotiations = [...currentNegotiations, newNegotiation];
    setStoredNegotiations(updatedNegotiations);
    return newNegotiation;
};


export const getAllNegotiationsForUser = (userId: string): { sent: Negotiation[], received: Negotiation[] } => {
    const allNegotiations = getStoredNegotiations();
    // Sent: Offers made by the user (as a generator/supplier)
    const sent = allNegotiations.filter(n => n.supplierId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // Received: Offers received by the user (as a transformer/requester)
    const received = allNegotiations.filter(n => n.requesterId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return { sent, received };
};

export const getNegotiationById = (id: string): Negotiation | undefined => {
    return getStoredNegotiations().find(n => n.id === id);
};

export const updateNegotiationStatus = (id: string, status: Negotiation['status']): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);

    if (index === -1) {
        throw new Error("Negotiation not found");
    }

    currentNegotiations[index].status = status;
    setStoredNegotiations(currentNegotiations);
    return currentNegotiations[index];
};


export const addMessageToNegotiation = (id: string, message: NegotiationMessage): Negotiation => {
    const currentNegotiations = getStoredNegotiations();
    const index = currentNegotiations.findIndex(n => n.id === id);

    if (index === -1) {
        throw new Error("Negotiation not found");
    }
    
    currentNegotiations[index].messages.push(message);
    setStoredNegotiations(currentNegotiations);
    return currentNegotiations[index];
}
