

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
  country: string;
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
    residueType: string;
    category: 'BIOMASS' | 'FOOD' | 'AGRO' | 'OTHERS';
    quantity: number;
    unit: 'KG' | 'TON';
    frequency: 'ONCE' | 'WEEKLY' | 'MONTHLY';
    specifications?: string;
    status: 'ACTIVE' | 'PAUSED' | 'CLOSED';
}

export type Match = {
  residueId: string;
  score: number;
  reason: string;
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
    senderId: string;
    content: string;
    timestamp: string;
};

export type Negotiation = {
    id: string;
    residueId: string; // The specific residue being offered
    residue: Residue;
    requesterId: string; // The one asking (transformer)
    requester: Company;
    supplierId: string; // The one providing (generator)
    supplier: Company;
    quantity: number;
    unit: 'KG' | 'TON';
    offerPrice?: number;
    status: 'SENT' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
    createdAt: string;
    messages: NegotiationMessage[];
}
