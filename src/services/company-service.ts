// src/services/company-service.ts
import type { Company } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error('Error fetching company:', error);
        return undefined;
    }
    
    return data as Company;
};

export const getAllCompanies = async (): Promise<Company[]> => {
    const { data, error } = await supabase
        .from('companies')
        .select('*');

    if (error) {
        console.error('Error fetching all companies:', error);
        return [];
    }

    return data as Company[];
};

export const updateCompany = async (id: string, updates: Partial<Omit<Company, 'id' | 'auth_id' | 'created_at'>>): Promise<Company> => {
    const { data, error } = await supabase
        .from('companies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating company:', error);
        throw error;
    }

    return data as Company;
};
