
// src/services/negotiation-service.ts
import type { Negotiation, NegotiationMessage, Residue, Need, Company } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { getResidueById } from './residue-service';
import { getCompanyById } from './company-service';

const supabase = createClient();

const COMMISSION_RATE = 0.03;

const rehydrateNegotiation = async (negotiation: any): Promise<Negotiation> => {
    const [residue, requester, supplier, messages] = await Promise.all([
        getResidueById(negotiation.residueId),
        getCompanyById(negotiation.requesterId),
        getCompanyById(negotiation.supplierId),
        supabase.from('negotiation_messages').select('*').eq('negotiation_id', negotiation.id).order('created_at', { ascending: true })
    ]);

    const hydratedResidue = residue || {
        id: negotiation.residueId,
        type: 'Residuo eliminado',
        category: 'OTHERS',
        quantity: 0,
        unit: 'KG',
        status: 'CLOSED',
        companyId: negotiation.supplierId,
        availabilityDate: new Date().toISOString(),
    };
    
    return {
        ...negotiation,
        residue: hydratedResidue,
        requester: requester,
        supplier: supplier,
        messages: messages.data || [],
    };
};

type NewNegotiationFromResidue = {
    type: 'request';
    residue: Residue;
    initiatorId: string;
    quantity: number;
    offerPrice?: number;
}

type NewNegotiationFromNeed = {
    type: 'offer';
    residue: Residue;
    need: Need;
    initiatorId: string;
    quantity: number;
    offerPrice?: number;
}

const checkExistingNegotiation = async (requesterId: string, supplierId: string, residueId: string): Promise<boolean> => {
    const { data, error } = await supabase
        .from('negotiations')
        .select('id')
        .eq('requesterId', requesterId)
        .eq('supplierId', supplierId)
        .eq('residueId', residueId)
        .eq('status', 'SENT')
        .maybeSingle();

    if (error) {
        console.error("Error checking existing negotiation:", error);
        return false;
    }

    return !!data;
};

export const addNegotiation = async (data: NewNegotiationFromResidue | NewNegotiationFromNeed): Promise<Negotiation | null> => {
    let negotiationData: Omit<Negotiation, 'id' | 'residue' | 'requester' | 'supplier' | 'createdAt' | 'messages'>;
    let requesterId: string, supplierId: string, residueId: string;

    if (data.type === 'request') {
        requesterId = data.initiatorId;
        supplierId = data.residue.companyId;
        residueId = data.residue.id;
    } else {
        requesterId = data.need.companyId;
        supplierId = data.initiatorId;
        residueId = data.residue.id;
    }

    if (await checkExistingNegotiation(requesterId, supplierId, residueId)) {
        console.warn("Attempted to create a duplicate negotiation.");
        return null;
    }
    
    const initialMessageContent = data.type === 'request'
        ? `Ha solicitado ${data.quantity} ${data.residue.unit} de ${data.residue.type}${data.offerPrice ? ` al precio de $${data.offerPrice}/${data.residue.unit}` : ''}.`
        : `Ha ofrecido ${data.quantity} ${data.residue.unit} de ${data.residue.type}${data.offerPrice ? ` a $${data.offerPrice}/${data.residue.unit}`: ''} para cubrir tu necesidad.`;

    negotiationData = {
        residueId,
        requesterId,
        supplierId,
        initiatedBy: data.initiatorId,
        quantity: data.quantity,
        unit: data.residue.unit,
        offerPrice: data.offerPrice,
        status: 'SENT',
    };

    const { data: newNegotiation, error } = await supabase
        .from('negotiations')
        .insert([negotiationData])
        .select()
        .single();
    
    if (error) {
        console.error("Error adding negotiation:", error);
        throw error;
    }

    // Now, add the initial message to the new messages table
    await addMessageToNegotiation(newNegotiation.id, data.initiatorId, initialMessageContent);

    return rehydrateNegotiation(newNegotiation);
};

export const getAllNegotiationsForUser = async (userId: string): Promise<{ sent: Negotiation[], received: Negotiation[] }> => {
    const { data: allUserNegotiations, error } = await supabase
        .from('negotiations')
        .select('*')
        .or(`requesterId.eq.${userId},supplierId.eq.${userId}`);

    if (error) {
        console.error("Error fetching negotiations for user:", error);
        return { sent: [], received: [] };
    }

    const rehydrated = await Promise.all(allUserNegotiations.map(rehydrateNegotiation));

    const sent = rehydrated
      .filter(n => n.initiatedBy === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    const received = rehydrated
      .filter(n => n.initiatedBy !== userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
    return { sent, received };
};

export const getNegotiationById = async (id: string): Promise<Negotiation | undefined> => {
    const { data, error } = await supabase
        .from('negotiations')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching negotiation by ID:", error);
        return undefined;
    }

    return rehydrateNegotiation(data);
};

export const updateNegotiationStatus = async (id: string, status: Negotiation['status']): Promise<Negotiation> => {
    const negotiation = await getNegotiationById(id);
    if (!negotiation) throw new Error("Negotiation not found");

    const updatePayload: Partial<Negotiation> = { status };
    
    if (status === 'ACCEPTED' && typeof negotiation.offerPrice === 'number') {
        updatePayload.commissionRate = COMMISSION_RATE;
        updatePayload.commissionValue = negotiation.quantity * negotiation.offerPrice * COMMISSION_RATE;
    }

    const { data, error } = await supabase
        .from('negotiations')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return rehydrateNegotiation(data);
};

export const updateNegotiationDetails = async (id: string, quantity: number, price?: number): Promise<Negotiation> => {
    const negotiation = await getNegotiationById(id);
    if (!negotiation) throw new Error("Negotiation not found");
    
    const originalQuantity = negotiation.quantity;
    const originalPrice = negotiation.offerPrice;

    let messageContent = "He modificado la oferta.";
    if (quantity !== originalQuantity) messageContent += ` Nueva cantidad: ${quantity} ${negotiation.unit}.`;
    if (price !== originalPrice) messageContent += ` Nuevo precio: ${price !== undefined ? `$${price}` : 'Negociable'}.`;

    await addMessageToNegotiation(id, negotiation.initiatedBy, messageContent);

    const { data, error } = await supabase
        .from('negotiations')
        .update({ quantity, offerPrice: price })
        .eq('id', id)
        .select()
        .single();
    
    if (error) throw error;
    return rehydrateNegotiation(data);
};

export const addMessageToNegotiation = async (negotiationId: string, senderId: string, content: string): Promise<NegotiationMessage> => {
    const { data, error } = await supabase
        .from('negotiation_messages')
        .insert({
            negotiation_id: negotiationId,
            sender_id: senderId,
            content: content
        })
        .select()
        .single();

    if (error) {
        console.error("Error sending message:", error);
        throw error;
    }
    return data;
}

export const deleteNegotiation = async (id: string): Promise<void> => {
    const { error } = await supabase.from('negotiations').delete().eq('id', id);
    if (error) throw error;
};

    
