
// src/services/impact-service.ts
import { createClient } from '@/lib/supabase/client';
import { format, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';

const supabase = createClient();

// Factores de conversión (estimaciones)
const KG_CO2_PER_TON_ORGANIC_WASTE = 750;
const KG_PER_TON = 1000;
const KG_CO2_PER_TREE_PER_YEAR = 21;

export type MonthlyImpact = {
  label: string; // ej. "Ene", "Feb"
  wasteDiverted: number;
  co2Avoided: number;
  economicValue: number;
};

export type CalculatedImpactMetrics = {
  totalWasteDiverted: number;
  totalCo2Avoided: number;
  totalEconomicValue: number;
  equivalentTreesPlanted: number;
  monthlyImpact: MonthlyImpact[];
};

export const getImpactMetrics = async (companyId: string): Promise<CalculatedImpactMetrics> => {
  // 1. Obtener todas las negociaciones ACEPTADAS donde la empresa participa
  const { data: negotiations, error } = await supabase
    .from('negotiations')
    .select('created_at, quantity, unit, offer_price')
    .eq('status', 'ACCEPTED')
    .or(`requester_id.eq.${companyId},supplier_id.eq.${companyId}`);

  if (error) {
    console.error("Error fetching completed negotiations:", error);
    throw error;
  }

  let totalWasteDiverted = 0;
  let totalEconomicValue = 0;
  
  const monthlyData: { [key: string]: Omit<MonthlyImpact, 'label'> } = {};

  // 2. Procesar cada negociación para agregar las métricas
  negotiations.forEach(neg => {
    const quantityInKg = neg.unit === 'TON' ? neg.quantity * KG_PER_TON : neg.quantity;
    totalWasteDiverted += quantityInKg;
    
    if (neg.offer_price) {
      totalEconomicValue += neg.quantity * neg.offer_price;
    }
    
    // Agrupar por mes
    const monthKey = format(startOfMonth(new Date(neg.created_at)), 'yyyy-MM');
    const monthLabel = format(new Date(neg.created_at), 'MMM', { locale: es });

    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { wasteDiverted: 0, co2Avoided: 0, economicValue: 0 };
    }
    
    monthlyData[monthKey].wasteDiverted += quantityInKg;
    if (neg.offer_price) {
      monthlyData[monthKey].economicValue += neg.quantity * neg.offer_price;
    }
  });

  // 3. Calcular métricas de CO2 basadas en el total de residuos
  const totalWasteInTons = totalWasteDiverted / KG_PER_TON;
  const totalCo2Avoided = totalWasteInTons * KG_CO2_PER_TON_ORGANIC_WASTE;
  const equivalentTreesPlanted = Math.round(totalCo2Avoided / KG_CO2_PER_TREE_PER_YEAR);

  // Calcular CO2 para cada mes y dar formato final al array
  const monthlyImpact: MonthlyImpact[] = Object.entries(monthlyData)
    .map(([key, value]) => {
      const wasteInTons = value.wasteDiverted / KG_PER_TON;
      const co2Avoided = wasteInTons * KG_CO2_PER_TON_ORGANIC_WASTE;
      return {
        label: format(new Date(key), 'MMM', { locale: es }),
        wasteDiverted: Math.round(value.wasteDiverted),
        co2Avoided: Math.round(co2Avoided),
        economicValue: Math.round(value.economicValue),
      };
    })
    .sort((a, b) => a.label.localeCompare(b.label, 'es', { month: 'short' }));


  // 4. Devolver el objeto completo
  return {
    totalWasteDiverted: Math.round(totalWasteDiverted),
    totalCo2Avoided: Math.round(totalCo2Avoided),
    totalEconomicValue: Math.round(totalEconomicValue),
    equivalentTreesPlanted,
    monthlyImpact,
  };
};
