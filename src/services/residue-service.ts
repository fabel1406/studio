
// src/services/residue-service.ts
import type { Residue } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const rehydrateResidue = async (residue: any): Promise<Residue> => {
    const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', residue.companyId)
        .single();

    if (error) console.error("Error fetching company for residue:", error);
    
    return { ...residue, company };
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

type NewResidueData = Omit<Residue, 'id' | 'availabilityDate' | 'photos' | 'company'>;

export const addResidue = async (residueData: NewResidueData): Promise<Residue> => {
    const newResiduePayload = {
        ...residueData,
        availabilityDate: new Date().toISOString(),
        photos: [`https://picsum.photos/seed/new${Date.now()}/600/400`],
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
    const { data, error } = await supabase
        .from('residues')
        .update(updatedResidueData)
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

    