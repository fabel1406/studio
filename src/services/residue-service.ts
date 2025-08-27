// src/services/residue-service.ts
import type { Residue, Company } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

// Helper to get the current state from localStorage
const getStoredResidues = (): Residue[] => {
    if (typeof window === 'undefined') {
        return mockResidues; // Return mock data during server-side rendering
    }
    // Always start with mock data for a clean slate
    setStoredResidues(mockResidues);
    return mockResidues;
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
    const residues = getStoredResidues();
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

export const updateResidue = (updatedResidue: Partial<Residue> & { id: string }): Residue => {
    const currentResidues = getStoredResidues();
    const index = currentResidues.findIndex(r => r.id === updatedResidue.id);

    if (index === -1) {
        throw new Error("Residue not found");
    }

    // Merge existing data with updated data
    currentResidues[index] = {
        ...currentResidues[index],
        ...updatedResidue,
    };
    
    setStoredResidues(currentResidues);
    return currentResidues[index];
};

export const deleteResidue = (id: string): void => {
    const currentResidues = getStoredResidues();
    const updatedResidues = currentResidues.filter(r => r.id !== id);
    setStoredResidues(updatedResidues);
};
