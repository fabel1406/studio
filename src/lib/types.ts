// src/lib/types.ts
export type Company = {
  id: string;
  name: string;
  type: 'GENERATOR' | 'TRANSFORMER' | 'BOTH';
  description?: string;
  contactEmail?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  country?: string;
  lat?: number;
  lng?: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
};

export type Residue = {
  id: string;
  companyId: string;
  company?: Company;
  type: string;
  category: 'BIOMASS' | 'FOOD' | 'AGRO' | 'OTHERS';
  quantity: number;
  unit: 'KG' | 'TON';
  moisturePct?: number;
  contaminants?: string;
  description?: string;
  photos?: string[];
  availabilityDate: string;
  pricePerUnit?: number;
  locationLat?: number;
  locationLng?: number;
  status: 'ACTIVE' | 'RESERVED' | 'CLOSED';
};

export type Need = {
    id: string;
    companyId: string;
    company?: Company;
    residueType: string;
    category: 'BIOMASS' | 'FOOD' | 'AGRO' | 'OTHERS';
    quantity: number;
    unit: 'KG' | 'TON';
    frequency: 'ONCE' | 'WEEKLY' | 'MONTHLY';
    specifications?: string;
    status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
}

export type Match = {
  sourceId: string;
  matchedId: string;
  score: number;
  reason: string;
  company?: Company;
};

export type ImpactMetric = {
  label: string;
  co2Avoided: number;
  wasteDiverted: number;
  savings: number;
};

export type UserResidue = {
    id: string;
    name: string;
}

export type NegotiationMessage = {
    id: string;
    negotiationId: string;
    senderId: string;
    content: string;
    createdAt: string;
};

export type Negotiation = {
    id: string;
    residueId: string; 
    residue: Residue;
    // The one who needs the residue
    requesterId: string; 
    requester?: Company;
    // The one who has the residue
    supplierId: string; 
    supplier?: Company;
    // Who started this negotiation
    initiatedBy: string;
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
    status: 'SENT' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    messages: NegotiationMessage[];
    commissionRate?: number;
    commissionValue?: number;
    requesterHidden?: boolean;
    supplierHidden?: boolean;
}