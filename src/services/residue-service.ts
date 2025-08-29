
// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

// --- In-memory "database" ---
// Let's treat mockResidues as an in-memory database that can be modified
let residuesDB = [...mockResidues];

// Helper to rehydrate residue with full company object
const rehydrateResidue = (residue: Residue): Residue => {
    return {
        ...residue,
        company: mockCompanies.find(c => c.id === residue.companyId)
    };
};

// --- Service Functions ---

export const getAllResidues = async (): Promise<Residue[]> => {
    // Rehydrate with company info on every call to ensure it's up-to-date
    return Promise.resolve(residuesDB.map(rehydrateResidue));
};

export const getResidueById = (id: string): Residue | undefined => {
    const residue = residuesDB.find(r => r.id === id);
    if (!residue) return undefined;
    return rehydrateResidue(residue);
};

type NewResidueData = Omit<Residue, 'id' | 'companyId' | 'availabilityDate' | 'photos' | 'company'>;

export const addResidue = (residueData: NewResidueData): Residue => {
    const newResidue: Residue = {
        ...residueData,
        id: `res-${Date.now()}`,
        companyId: 'comp-1', // Mock current user's company
        availabilityDate: new Date().toISOString(),
        photos: [`https://picsum.photos/seed/new${Date.now()}/600/400`],
    };
    
    residuesDB.push(newResidue);
    return rehydrateResidue(newResidue);
};

export const updateResidue = (updatedResidueData: Partial<Residue> & { id: string }): Residue => {
    const index = residuesDB.findIndex(r => r.id === updatedResidueData.id);
    if (index === -1) {
        throw new Error("Residue not found");
    }
    
    const updatedResidue = { 
        ...residuesDB[index], 
        ...updatedResidueData 
    };

    residuesDB[index] = updatedResidue;
    
    return rehydrateResidue(updatedResidue);
};

export const deleteResidue = (id: string): void => {
    residuesDB = residuesDB.filter(r => r.id !== id);
};
