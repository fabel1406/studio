// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { mockNeeds } from '@/lib/data';

// Treat mockNeeds as an in-memory database
let needsDB = [...mockNeeds];

// --- Service Functions ---

export const getAllNeeds = (): Need[] => {
    return needsDB;
};

export const getNeedById = (id: string): Need | undefined => {
    return needsDB.find(n => n.id === id);
};

export const addNeed = (needData: Omit<Need, 'id' | 'companyId'>): Need => {
    const newNeed: Need = {
        ...needData,
        id: `need-${Date.now()}`, // Simple unique ID
        companyId: 'comp-3', // Mock current user's company (a transformer)
    };
    needsDB.push(newNeed);
    return newNeed;
};

export const updateNeed = (updatedNeed: Need): Need => {
    const index = needsDB.findIndex(n => n.id === updatedNeed.id);

    if (index === -1) {
        throw new Error("Need not found");
    }

    const newNeed = {
        ...needsDB[index],
        ...updatedNeed,
    };
    needsDB[index] = newNeed;
    
    return newNeed;
};

export const deleteNeed = (id: string): void => {
    needsDB = needsDB.filter(n => n.id !== id);
};
