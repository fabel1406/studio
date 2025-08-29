// src/services/company-service.ts
import type { Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
    // Simulate an async operation, e.g., a database call
    return Promise.resolve(mockCompanies.find(c => c.id === id));
};

export const getAllCompanies = async (): Promise<Company[]> => {
    return Promise.resolve(mockCompanies);
};
