// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getCompanyById } from './company-service';

const supabase = createClient();

const rehydrateResidue = async (residue: any): Promise<Residue> => {
    // Now using the robust getCompanyById service
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
        company: company, // Attach the fully rehydrated company object
    }
    
    return mappedResidue;
};


export const getAllResidues = async (): Promise<Residue[]> => {
    const { data, error } = await supabase
        .from('residues')
        .select('*');

    if (error) {
        console.error('Error fetching residues:', error);
        return [];
    }

    const rehydratedResidues = await Promise.all(data.map(rehydrateResidue));
    return rehydratedResidues;
};

export const getResidueById = async (id: string): Promise<Residue | undefined> => {
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
};

type NewResidueData = Omit<Residue, 'id' | 'availabilityDate' | 'company'>;

export const addResidue = async (residueData: NewResidueData): Promise<Residue> => {
    // Map from camelCase (ts) to snake_case (db)
    const newResiduePayload = {
        company_id: residueData.companyId,
        type: residueData.type,
        category: residueData.category,
        quantity: residueData.quantity,
        unit: residueData.unit,
        price_per_unit: residueData.pricePerUnit,
        status: residueData.status,
        description: residueData.description,
        availability_date: new Date().toISOString(),
        photos: residueData.photos,
    };

    const { data, error } = await supabase
        .from('residues')
        .insert([newResiduePayload])
        .select()
        .single();
    
    if (error) {
        console.error('Error adding residue:', error);
        throw error;
    }

    // IMPORTANT: Rehydrate the new residue to include company details
    // before returning. This fixes the missing location issue.
    const finalResidue = await getResidueById(data.id);
    if (!finalResidue) {
        throw new Error("Failed to rehydrate residue after creation.");
    }

    return finalResidue;
};

export const updateResidue = async (updatedResidueData: Partial<Residue> & { id: string }): Promise<Residue> => {
     const updatePayload: any = {
        id: updatedResidueData.id,
        company_id: updatedResidueData.companyId,
        type: updatedResidueData.type,
        category: updatedResidueData.category,
        quantity: updatedResidueData.quantity,
        unit: updatedResidueData.unit,
        price_per_unit: updatedResidueData.pricePerUnit,
        status: updatedResidueData.status,
        description: updatedResidueData.description,
     };
    
     // Only include photos if they are provided in the update
     if (updatedResidueData.photos) {
        updatePayload.photos = updatedResidueData.photos;
     }

    const { data, error } = await supabase
        .from('residues')
        .update(updatePayload)
        .eq('id', updatedResidueData.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating residue:', error);
        throw error;
    }
    
    // IMPORTANT: Rehydrate the updated residue
    const finalResidue = await getResidueById(data.id);
    if (!finalResidue) {
        throw new Error("Failed to rehydrate residue after update.");
    }
    
    return finalResidue;
};

export const deleteResidue = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('residues')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting residue:', error);
        throw error;
    }
};
