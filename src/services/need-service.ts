
// src/services/need-service.ts
import type { Need } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();

const rehydrateNeed = async (need: any): Promise<Need> => {
    const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', need.companyId)
        .single();

    if (error) console.error("Error fetching company for need:", error);
    
    return { ...need, company };
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
    const { data, error } = await supabase
        .from('needs')
        .insert([needData])
        .select()
        .single();

    if (error) {
        console.error('Error adding need:', error);
        throw error;
    }

    return rehydrateNeed(data);
};

export const updateNeed = async (updatedNeed: Partial<Need> & { id: string }): Promise<Need> => {
    const { data, error } = await supabase
        .from('needs')
        .update(updatedNeed)
        .eq('id', updatedNeed.id)
        .select()
        .single();

    if (error) {
        console.error('Error updating need:', error);
        throw error;
    }

    return rehydrateNeed(data);
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

    