// src/services/residue-service.ts
import { mockResidues, mockCompanies } from "@/lib/data";
import type { Residue } from "@/lib/types";

const RESIDUE_STORAGE_KEY = 'eco-connect-residues';

// Function to get all residues. It initializes from mock data if localStorage is empty.
export const getAllResidues = (): Residue[] => {
  try {
    const storedResidues = localStorage.getItem(RESIDUE_STORAGE_KEY);
    if (storedResidues) {
      return JSON.parse(storedResidues);
    } else {
      // Initialize with mock data if nothing is in localStorage
      localStorage.setItem(RESIDUE_STORAGE_KEY, JSON.stringify(mockResidues));
      return mockResidues;
    }
  } catch (error) {
    // If window is not defined (e.g., during SSR), return mock data.
    return mockResidues;
  }
};

// Function to get a single residue by its ID
export const getResidueById = (id: string): Residue | undefined => {
  const residues = getAllResidues();
  return residues.find(r => r.id === id);
};

// Function to add a new residue
export const addResidue = (residue: Omit<Residue, 'company'>) => {
  const residues = getAllResidues();
  const newResidue: Residue = {
    ...residue,
    // In a real app, you would fetch company data based on companyId
    company: mockCompanies.find(c => c.id === residue.companyId),
  }
  const updatedResidues = [...residues, newResidue];
  localStorage.setItem(RESIDUE_STORAGE_KEY, JSON.stringify(updatedResidues));
};

// Function to update an existing residue
export const updateResidue = (updatedResidue: Omit<Residue, 'company'>) => {
  let residues = getAllResidues();
  residues = residues.map(r => {
    if (r.id === updatedResidue.id) {
      // Merge the existing residue with the updated fields
      return { ...r, ...updatedResidue };
    }
    return r;
  });
  localStorage.setItem(RESIDUE_STORAGE_KEY, JSON.stringify(residues));
};

// Function to delete a residue by its ID
export const deleteResidue = (id: string) => {
  let residues = getAllResidues();
  residues = residues.filter(r => r.id !== id);
  localStorage.setItem(RESIDUE_STORAGE_KEY, JSON.stringify(residues));
};