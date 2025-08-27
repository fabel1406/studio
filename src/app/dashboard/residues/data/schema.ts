// src/app/dashboard/residues/data/schema.ts
import { z } from "zod"

export const residueSchema = z.object({
  id: z.string(),
  companyId: z.string(),
  type: z.string(),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS']),
  quantity: z.number(),
  unit: z.enum(['KG', 'TON']),
  availabilityDate: z.string(),
  status: z.enum(['ACTIVE', 'RESERVED', 'CLOSED']),
})

export type ResidueSchema = z.infer<typeof residueSchema>
