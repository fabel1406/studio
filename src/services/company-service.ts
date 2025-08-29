// src/services/company-service.ts
import type { Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
    return Promise.resolve(mockCompanies.find(c => c.id === id));
};
