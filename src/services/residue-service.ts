// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const rehydrateResidue = async (residue: any): Promise<Residue> => {
    const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', residue.company_id)
        .single();

    if (error) console.error("Error fetching company for residue:", error);
    
    const companyData: any = company;

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
        company: company ? {
            id: companyData.id,
            name: companyData.name,
            type: companyData.type,
            description: companyData.description,
            contactEmail: companyData.contact_email,
            phone: companyData.phone,
            website: companyData.website,
            address: companyData.address,
            city: companyData.city,
            country: companyData.country,
            verificationStatus: companyData.verification_status,
        } : undefined,
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
        photos: residueData.photos || [`https://picsum.photos/seed/default${Date.now()}/600/400`],
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

    return rehydrateResidue(data);
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
    
    return rehydrateResidue(data);
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
