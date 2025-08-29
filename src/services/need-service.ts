// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { mockNeeds, mockCompanies } from '@/lib/data';

// Helper to rehydrate need with full company object
const rehydrateNeed = (need: Need): Need => {
    return {
        ...need,
        company: mockCompanies.find(c => c.id === need.companyId)
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

export const addNeed = async (needData: Omit<Need, 'id' | 'companyId' | 'company'>): Promise<Need> => {
    const newNeed: Need = {
        ...needData,
        id: `need-${Date.now()}`, // Simple unique ID
        companyId: 'comp-3', // Mock current user's company (a transformer)
    };
    needsDB.push(newNeed);
    return Promise.resolve(rehydrateNeed(newNeed));
};

export const updateNeed = async (updatedNeed: Need): Promise<Need> => {
    const index = needsDB.findIndex(n => n.id === updatedNeed.id);

    if (index === -1) {
        throw new Error("Need not found");
    }

    const newNeed = {
        ...needsDB[index],
        ...updatedNeed,
    };
    needsDB[index] = newNeed;
    
    return Promise.resolve(rehydrateNeed(newNeed));
};

export const deleteNeed = async (id: string): Promise<void> => {
    needsDB = needsDB.filter(n => n.id !== id);
    return Promise.resolve();
};
