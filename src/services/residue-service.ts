// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';

// --- Service Functions ---

// Let's treat mockResidues as an in-memory database
let residuesDB = [...mockResidues];

export const getAllResidues = (): Residue[] => {
    // Rehydrate with company info on every call to ensure it's up-to-date
    return residuesDB.map(residue => ({
        ...residue,
        company: mockCompanies.find(c => c.id === residue.companyId)
    }));
};

export const getResidueById = (id: string): Residue | undefined => {
    const residue = residuesDB.find(r => r.id === id);
    if (!residue) return undefined;
    return {
        ...residue,
        company: mockCompanies.find(c => c.id === residue.companyId)
    };
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
    return newResidue;
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
    
    return {
        ...updatedResidue,
        company: mockCompanies.find(c => c.id === updatedResidue.companyId)
    };
};

export const deleteResidue = (id: string): void => {
    residuesDB = residuesDB.filter(r => r.id !== id);
};
