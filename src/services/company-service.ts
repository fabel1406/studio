// src/services/company-service.ts
import type { Company } from '@/lib/types';
import { mockCompanies } from '@/lib/data';

export const getCompanyById = (id: string): Company | undefined => {
    return mockCompanies.find(c => c.id === id);
};
