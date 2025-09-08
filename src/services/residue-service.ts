
// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { mockResidues, mockCompanies } from '@/lib/data';
import { getCompanyById } from './company-service';

// --- In-memory "database" ---
// Let's treat mockResidues as an in-memory database that can be modified
let residuesDB = [...mockResidues];

// Helper to rehydrate residue with full company object
const rehydrateResidue = (residue: Residue): Residue => {
    const company = mockCompanies.find(c => c.id === residue.companyId);
    return {
        ...residue,
        company: company,
    };
};

// --- Service Functions ---

export const getAllResidues = async (): Promise<Residue[]> => {
    // Rehydrate with company info on every call to ensure it's up-to-date
    return Promise.resolve(residuesDB.map(rehydrateResidue));
};

export const getResidueById = async (id: string): Promise<Residue | undefined> => {
    const residue = residuesDB.find(r => r.id === id);
    if (!residue) return Promise.resolve(undefined);
    return Promise.resolve(rehydrateResidue(residue));
};

type NewResidueData = Omit<Residue, 'id' | 'companyId' | 'availabilityDate' | 'photos' | 'company'> & { city: string, country: string };

export const addResidue = async (residueData: NewResidueData): Promise<Residue> => {
    const companyId = 'comp-1'; // Mock current user's company
    const company = await getCompanyById(companyId);

    const newResidue: Residue = {
        ...residueData,
        id: `res-${Date.now()}`,
        companyId,
        availabilityDate: new Date().toISOString(),
        photos: [`https://picsum.photos/seed/new${Date.now()}/600/400`],
        company: {
            ...company!,
            city: residueData.city,
            country: residueData.country
        }
    };
    
    residuesDB.push(newResidue);
    return Promise.resolve(rehydrateResidue(newResidue));
};

export const updateResidue = async (updatedResidueData: Partial<Residue> & { id: string, city: string, country: string }): Promise<Residue> => {
    const index = residuesDB.findIndex(r => r.id === updatedResidueData.id);
    if (index === -1) {
        throw new Error("Residue not found");
    }
    
    const existingResidue = residuesDB[index];
    const company = await getCompanyById(existingResidue.companyId);
    
    const updatedResidue = { 
        ...existingResidue, 
        ...updatedResidueData,
        company: {
            ...company!,
            city: updatedResidueData.city,
            country: updatedResidueData.country
        }
    };

    residuesDB[index] = updatedResidue;
    
    return Promise.resolve(rehydrateResidue(updatedResidue));
};

export const deleteResidue = async (id: string): Promise<void> => {
    residuesDB = residuesDB.filter(r => r.id !== id);
    return Promise.resolve();
};
