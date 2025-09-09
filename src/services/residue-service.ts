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
            .select('*');

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

type NewResidueData = Omit<Residue, 'id' | 'availabilityDate' | 'company' | 'photos'>;

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
        photos: [], // Se inicia sin fotos, la foto se sube y se añade después.
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

    const finalResidue = await rehydrateResidue(data);
    if (!finalResidue) {
        throw new Error("Failed to rehydrate residue after creation.");
    }

    return finalResidue;
};

export const updateResidue = async (updatedResidueData: Partial<Residue> & { id: string }): Promise<Residue> => {
     const updatePayload: any = {
        id: updatedResidueData.id,
     };
     
     // Only include fields that are actually being updated
     if (updatedResidueData.companyId) updatePayload.company_id = updatedResidueData.companyId;
     if (updatedResidueData.type) updatePayload.type = updatedResidueData.type;
     if (updatedResidueData.category) updatePayload.category = updatedResidueData.category;
     if (updatedResidueData.quantity) updatePayload.quantity = updatedResidueData.quantity;
     if (updatedResidueData.unit) updatePayload.unit = updatedResidueData.unit;
     if (updatedResidueData.pricePerUnit !== undefined) updatePayload.price_per_unit = updatedResidueData.pricePerUnit;
     if (updatedResidueData.status) updatePayload.status = updatedResidueData.status;
     if (updatedResidueData.description) updatePayload.description = updatedResidueData.description;
     if (updatedResidueData.photos) updatePayload.photos = updatedResidueData.photos;
     

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
    
    const finalResidue = await rehydrateResidue(data);
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
