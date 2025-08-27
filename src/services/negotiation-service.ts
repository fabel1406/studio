// src/services/negotiation-service.ts
import type { Negotiation, Residue, Company } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

const getStoredNegotiations = (): Negotiation[] => {
    if (typeof window === 'undefined') {
        return [];
    }
    const storedData = localStorage.getItem('negotiations');
    if (storedData) {
        // Re-hydrate the nested objects from mock data
        const negotiations: Negotiation[] = JSON.parse(storedData);
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
        // Strip nested objects before storing to avoid data duplication and circular references
        const dataToStore = negotiations.map(({ residue, requester, supplier, ...rest }) => rest);
        localStorage.setItem('negotiations', JSON.stringify(dataToStore));
    }
};

// Initialize if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem('negotiations')) {
    setStoredNegotiations([]);
}

// --- Service Functions ---

type NewNegotiationData = {
    residueId: string;
    supplierId: string;
    requesterId: string;
    quantity: number;
    unit: 'KG' | 'TON';
}

export const addNegotiation = (data: NewNegotiationData): Negotiation => {
    const currentNegotiations = getStoredNegotiations();

    const residue = mockResidues.find(r => r.id === data.residueId);
    const supplier = mockCompanies.find(c => c.id === data.supplierId);
    const requester = mockCompanies.find(c => c.id === data.requesterId);

    if (!residue || !supplier || !requester) {
        throw new Error("Invalid data provided for negotiation.");
    }

    const newNegotiation: Negotiation = {
        id: `neg-${Date.now()}`,
        residueId: data.residueId,
        supplierId: data.supplierId,
        requesterId: data.requesterId,
        quantity: data.quantity,
        unit: data.unit,
        residue: residue,
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
    const sent = allNegotiations.filter(n => n.requesterId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const received = allNegotiations.filter(n => n.supplierId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
}
