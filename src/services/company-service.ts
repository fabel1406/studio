// src/services/company-service.ts
import type { Company } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

export const getCompanyById = async (id: string): Promise<Company | undefined> => {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) {
            console.error(`Error fetching company with id ${id}:`, error);
            return undefined;
        }
        
        if (!data) return undefined;

        // Map from snake_case (db) to camelCase (ts)
        const company: Company = {
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description,
          contactEmail: data.contact_email,
          phone: data.phone,
          website: data.website,
          address: data.address,
          city: data.city,
          country: data.country,
          verificationStatus: data.verification_status,
        };
        
        return company;
    } catch (e) {
        console.error(`Unexpected error in getCompanyById for id ${id}:`, e);
        return undefined;
    }
};

export const getAllCompanies = async (): Promise<Company[]> => {
    try {
        const { data, error } = await supabase
            .from('companies')
            .select('*');

        if (error) {
            console.error('Error fetching all companies:', error);
            return [];
        }

        return data.map(d => ({
          id: d.id,
          name: d.name,
          type: d.type,
          description: d.description,
          contactEmail: d.contact_email,
          phone: d.phone,
          website: d.website,
          address: d.address,
          city: d.city,
          country: d.country,
          verificationStatus: d.verification_status,
        })) as Company[];
    } catch(e) {
        console.error('Unexpected error in getAllCompanies:', e);
        return [];
    }
};
