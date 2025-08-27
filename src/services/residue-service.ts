// src/services/residue-service.ts
import type { Residue, Company } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

// Helper to get the current state from localStorage
const getStoredResidues = (): Residue[] => {
    if (typeof window === 'undefined') {
        return mockResidues; // Return mock data during server-side rendering
    }
    const storedData = localStorage.getItem('residues');
    if (storedData) {
        // Parse and add company object back to each residue
        const residues: Residue[] = JSON.parse(storedData);
        return residues.map(residue => ({
            ...residue,
            company: mockCompanies.find(c => c.id === residue.companyId)
        }));
    }
    return mockResidues; // Initialize with mock data if nothing is stored
};

// Helper to save the state to localStorage
const setStoredResidues = (residues: Residue[]): void => {
    if (typeof window !== 'undefined') {
        // Remove company object before storing to avoid circular references in JSON
        const dataToStore = residues.map(({ company, ...rest }) => rest);
        localStorage.setItem('residues', JSON.stringify(dataToStore));
    }
};

// Initialize the storage if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem('residues')) {
    setStoredResidues(mockResidues);
}


// --- Service Functions ---

export const getAllResidues = (): Residue[] => {
    return getStoredResidues();
};

export const getResidueById = (id: string): Residue | undefined => {
    return getStoredResidues().find(r => r.id === id);
};

export const addResidue = (residueData: Omit<Residue, 'id' | 'companyId' | 'availabilityDate'>): Residue => {
    const currentResidues = getStoredResidues();
    const newResidue: Residue = {
        ...residueData,
        id: `res-${Date.now()}`, // Simple unique ID
        companyId: 'comp-1', // Mock current user's company
        company: mockCompanies.find(c => c.id === 'comp-1'),
        availabilityDate: new Date().toISOString(),
        photos: ['https://picsum.photos/seed/new/600/400'],
    };
    const updatedResidues = [...currentResidues, newResidue];
    setStoredResidues(updatedResidues);
    return newResidue;
};

export const updateResidue = (updatedResidue: Residue): Residue => {
    const currentResidues = getStoredResidues();
    const index = currentResidues.findIndex(r => r.id === updatedResidue.id);

    if (index === -1) {
        throw new Error("Residue not found");
    }

    currentResidues[index] = {
        ...currentResidues[index], // Keep old data
        ...updatedResidue, // Overwrite with new data
    };
    
    setStoredResidues(currentResidues);
    return currentResidues[index];
};

export const deleteResidue = (id: string): void => {
    const currentResidues = getStoredResidues();
    const updatedResidues = currentResidues.filter(r => r.id !== id);
    setStoredResidues(updatedResidues);
};
