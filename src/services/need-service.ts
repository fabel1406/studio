// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { mockNeeds } from '@/lib/data';

// Helper to get the current state from localStorage
const getStoredNeeds = (): Need[] => {
    if (typeof window === 'undefined') {
        return mockNeeds; // Return mock data during server-side rendering
    }
    // Always start with mock data for a clean slate
    setStoredNeeds(mockNeeds);
    return mockNeeds;
};

// Helper to save the state to localStorage
const setStoredNeeds = (needs: Need[]): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('needs', JSON.stringify(needs));
    }
};

// Initialize the storage if it doesn't exist
if (typeof window !== 'undefined' && !localStorage.getItem('needs')) {
    setStoredNeeds(mockNeeds);
}


// --- Service Functions ---

export const getAllNeeds = (): Need[] => {
    return getStoredNeeds();
};

export const getNeedById = (id: string): Need | undefined => {
    return getStoredNeeds().find(n => n.id === id);
};

export const addNeed = (needData: Omit<Need, 'id' | 'companyId'>): Need => {
    const currentNeeds = getStoredNeeds();
    const newNeed: Need = {
        ...needData,
        id: `need-${Date.now()}`, // Simple unique ID
        companyId: 'comp-3', // Mock current user's company (a transformer)
    };
    const updatedNeeds = [...currentNeeds, newNeed];
    setStoredNeeds(updatedNeeds);
    return newNeed;
};

export const updateNeed = (updatedNeed: Need): Need => {
    const currentNeeds = getStoredNeeds();
    const index = currentNeeds.findIndex(n => n.id === updatedNeed.id);

    if (index === -1) {
        throw new Error("Need not found");
    }

    currentNeeds[index] = {
        ...currentNeeds[index], // Keep old data
        ...updatedNeed, // Overwrite with new data
    };
    
    setStoredNeeds(currentNeeds);
    return currentNeeds[index];
};

export const deleteNeed = (id: string): void => {
    const currentNeeds = getStoredNeeds();
    const updatedNeeds = currentNeeds.filter(n => n.id !== id);
    setStoredNeeds(updatedNeeds);
};
