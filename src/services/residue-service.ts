// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getCompanyById } from './company-service';

const supabase = createClient();

const rehydrateResidue = async (residue: any): Promise<Residue> => {
    const company = await getCompanyById(residue.company_id);

    // Map from snake_case (db) to camelCase (ts)
    const mappedResidue: Residue = {
        id: residue.id,
        companyId: residue.company_id,
        type: residue.type,
        category: residue.category,
        quantity: residue.quantity,
        unit: residue.unit,
        description: residue.description,
        photos: residue.photos,
        availabilityDate: residue.availability_date,
        pricePerUnit: residue.price_per_unit,
        status: residue.status,
        company: company,
    };
    
    return mappedResidue;
};


export const getAllResidues = async (): Promise<Residue[]> => {
    try {
        const { data, error } = await supabase
            .from('residues')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching residues:', error);
            return [];
        }

        const rehydratedResidues = await Promise.all(data.map(rehydrateResidue));
        return rehydratedResidues;
    } catch(e) {
        console.error('Error in getAllResidues:', e);
        return [];
    }
};

export const getResidueById = async (id: string): Promise<Residue | undefined> => {
    try {
        const { data, error } = await supabase
            .from('residues')
            .select('*')
            .eq('id', id)
            .single();
            
        if (error) {
            console.error(`Error fetching residue ${id}:`, error);
            return undefined;
        }

        return rehydrateResidue(data);
    } catch(e) {
        console.error('Error in getResidueById:', e);
        return undefined;
    }
};
