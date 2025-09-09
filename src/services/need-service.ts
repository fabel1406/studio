// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getCompanyById } from './company-service';

const supabase = createClient();

const rehydrateNeed = async (need: any): Promise<Need> => {
    const company = await getCompanyById(need.company_id);

    if (!company) {
      console.warn(`Company not found for need with company_id: ${need.company_id}`);
    }

    const mappedNeed: Need = {
        id: need.id,
        companyId: need.company_id,
        residueType: need.residue_type,
        category: need.category,
        quantity: need.quantity,
        unit: need.unit,
        frequency: need.frequency,
        specifications: need.specifications,
        status: need.status,
        company: company,
    };

    return mappedNeed;
};

export const getAllNeeds = async (): Promise<Need[]> => {
    const { data, error } = await supabase
        .from('needs')
        .select('*');

    if (error) {
        console.error('Error fetching needs:', error);
        return [];
    }

    const rehydratedNeeds = await Promise.all(data.map(rehydrateNeed));
    return rehydratedNeeds;
};

export const getNeedById = async (id: string): Promise<Need | undefined> => {
    const { data, error } = await supabase
        .from('needs')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching need by id:', error);
        return undefined;
    }

    return rehydrateNeed(data);
};

export const addNeed = async (needData: Omit<Need, 'id' | 'company'>): Promise<Need> => {
    const newNeedPayload = {
      company_id: needData.companyId,
      residue_type: needData.residueType,
      category: needData.category,
      quantity: needData.quantity,
      unit: needData.unit,
      frequency: needData.frequency,
      specifications: needData.specifications,
      status: needData.status,
    };

    const { data, error } = await supabase
        .from('needs')
        .insert([newNeedPayload])
        .select()
        .single();

    if (error) {
        console.error('Error adding need:', error);
        throw error;
    }

    const finalNeed = await getNeedById(data.id);
    if (!finalNeed) {
      throw new Error("Failed to rehydrate need after creation.");
    }
    return finalNeed;
};

export const updateNeed = async (updatedNeed: Partial<Need> & { id: string }): Promise<Need> => {
    const updatePayload = {
      id: updatedNeed.id,
      company_id: updatedNeed.companyId,
      residue_type: updatedNeed.residueType,
      category: updatedNeed.category,
      quantity: updatedNeed.quantity,
      unit: updatedNeed.unit,
      frequency: updatedNeed.frequency,
      specifications: updatedNeed.specifications,
      status: updatedNeed.status,
    };

    const { data, error } = await supabase
        .from('needs')
        .update(updatePayload)
        .eq('id', updatedNeed.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating need:', error);
        throw error;
    }
    
    const finalNeed = await getNeedById(data.id);
    if (!finalNeed) {
      throw new Error("Failed to rehydrate need after update.");
    }
    return finalNeed;
};

export const deleteNeed = async (id: string): Promise<void> => {
    const { error } = await supabase
        .from('needs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting need:', error);
        throw error;
    }
};
