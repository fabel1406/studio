// src/services/residue-service.ts
import type { Residue, Company } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

// Helper to get the current state from localStorage
const getStoredResidues = (): Residue[] => {
    if (typeof window === 'undefined') {
        // On the server, always use the in-memory mockResidues
        return mockResidues;
    }
    try {
        const storedData = localStorage.getItem('residues');
        // If localStorage is empty, initialize it with mock data
        if (!storedData) {
            setStoredResidues(mockResidues);
            return mockResidues;
        }
        return JSON.parse(storedData) as Residue[];
    } catch (e) {
        console.error("Failed to parse residues from localStorage", e);
        return mockResidues;
    }
};

// Helper to save the state to localStorage
const setStoredResidues = (residues: Residue[]): void => {
    if (typeof window !== 'undefined') {
        // Remove company object before storing to avoid circular references in JSON
        const dataToStore = residues.map(({ company, ...rest }) => rest);
        localStorage.setItem('residues', JSON.stringify(dataToStore));
    }
};


// --- Service Functions ---

export const getAllResidues = (): Residue[] => {
    const residues = getStoredResidues();
    // Rehydrate with company info on every call to ensure it's up-to-date
    return residues.map(residue => ({
        ...residue,
        company: mockCompanies.find(c => c.id === residue.companyId)
    }));
};

export const getResidueById = (id: string): Residue | undefined => {
    return getAllResidues().find(r => r.id === id);
};

type NewResidueData = Omit<Residue, 'id' | 'companyId' | 'availabilityDate' | 'photos' | 'company'>;

export const addResidue = (residueData: NewResidueData): Residue => {
    const newResidue: Residue = {
        ...residueData,
        id: `res-${Date.now()}`, // Simple unique ID
        companyId: 'comp-1', // Mock current user's company
        availabilityDate: new Date().toISOString(),
        photos: ['https://picsum.photos/seed/new/600/400'],
    };
    
    // Update the in-memory array for server-side access
    mockResidues.push(newResidue);

    // Update localStorage for client-side persistence
    if (typeof window !== 'undefined') {
        const currentResidues = getStoredResidues();
        const updatedResidues = [...currentResidues, newResidue];
        setStoredResidues(updatedResidues);
    }
    
    return newResidue;
};

export const updateResidue = (updatedResidue: Partial<Residue> & { id: string }): Residue => {
    // Update the in-memory array for server-side access
    const mockIndex = mockResidues.findIndex(r => r.id === updatedResidue.id);
    if (mockIndex === -1) {
        throw new Error("Residue not found in mock data");
    }
    mockResidues[mockIndex] = { ...mockResidues[mockIndex], ...updatedResidue };

    // Update localStorage for client-side persistence
     if (typeof window !== 'undefined') {
        const currentResidues = getStoredResidues();
        const index = currentResidues.findIndex(r => r.id === updatedResidue.id);
        if (index !== -1) {
             currentResidues[index] = { ...currentResidues[index], ...updatedResidue };
             setStoredResidues(currentResidues);
        }
    }
    
    return {
        ...mockResidues[mockIndex],
        company: mockCompanies.find(c => c.id === mockResidues[mockIndex].companyId)
    };
};

export const deleteResidue = (id: string): void => {
    // Remove from the in-memory array
    const mockIndex = mockResidues.findIndex(r => r.id === id);
    if (mockIndex !== -1) {
        mockResidues.splice(mockIndex, 1);
    }

    // Remove from localStorage
    if (typeof window !== 'undefined') {
        const currentResidues = getStoredResidues();
        const updatedResidues = currentResidues.filter(r => r.id !== id);
        setStoredResidues(updatedResidues);
    }
};