
// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { mockNeeds, mockCompanies } from '@/lib/data';
import { getCompanyById } from './company-service';

// Helper to rehydrate need with full company object
const rehydrateNeed = (need: Need): Need => {
    const company = mockCompanies.find(c => c.id === need.companyId);
    return {
        ...need,
        company: company
    };
};

// Treat mockNeeds as an in-memory database
let needsDB = [...mockNeeds];

// --- Service Functions ---

export const getAllNeeds = async (): Promise<Need[]> => {
    return Promise.resolve(needsDB.map(rehydrateNeed));
};

export const getNeedById = async (id: string): Promise<Need | undefined> => {
    const need = needsDB.find(n => n.id === id);
    return Promise.resolve(need ? rehydrateNeed(need) : undefined);
};

export const addNeed = async (needData: Omit<Need, 'id' | 'companyId' | 'company'> & { city: string, country: string }): Promise<Need> => {
    const companyId = 'comp-3'; // Mock current user's company (a transformer)
    const company = await getCompanyById(companyId);
    
    const newNeed: Need = {
        ...needData,
        id: `need-${Date.now()}`, // Simple unique ID
        companyId,
        company: {
            ...company!,
            city: needData.city,
            country: needData.country,
        }
    };
    needsDB.push(newNeed);
    return Promise.resolve(rehydrateNeed(newNeed));
};

export const updateNeed = async (updatedNeed: Need & { city: string, country: string }): Promise<Need> => {
    const index = needsDB.findIndex(n => n.id === updatedNeed.id);

    if (index === -1) {
        throw new Error("Need not found");
    }
    
    const company = await getCompanyById(updatedNeed.companyId);

    const newNeed = {
        ...needsDB[index],
        ...updatedNeed,
        company: {
            ...company!,
            city: updatedNeed.city,
            country: updatedNeed.country,
        }
    };
    needsDB[index] = newNeed;
    
    return Promise.resolve(rehydrateNeed(newNeed));
};

export const deleteNeed = async (id: string): Promise<void> => {
    needsDB = needsDB.filter(n => n.id !== id);
    return Promise.resolve();
};
