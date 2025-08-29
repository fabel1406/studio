
// src/components/need-card.tsx
"use client";

import Link from "next/link";
import type { Need, Residue } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Layers, MapPin, Repeat, ArrowRight, PackageCheck } from "lucide-react";
import { mockCompanies } from "@/lib/data";
import { useRole } from "@/app/dashboard/role-provider";
import { OfferDialog } from "./offer-dialog";
import { useState, useEffect } from "react";
import { getAllResidues } from "@/services/residue-service";

export function NeedCard({ need, isRecommendation = false }: { need: Need, isRecommendation?: boolean }) {
  const company = mockCompanies.find(c => c.id === need.companyId);
  const freqMap: {[key: string]: string} = { 'ONCE': 'una vez', 'WEEKLY': 'semanal', 'MONTHLY': 'mensual' };
  const { role, currentUserId } = useRole();
  const [isMounted, setIsMounted] = useState(false);
  const [userResidues, setUserResidues] = useState<Residue[]>([]);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  
  const canOffer = (role === 'GENERATOR' || role === 'BOTH') && need.companyId !== currentUserId;

  useEffect(() => {
    setIsMounted(true);
    async function loadResidues() {
        if (canOffer && currentUserId) {
            // Mock logic: 'BOTH' user (comp-3) can offer residues from their generator counterpart (comp-1)
            // In a real app, a user with BOTH roles might have multiple company profiles associated with them.
            const generatorCompanyId = role === 'BOTH' ? 'comp-1' : currentUserId;
            const allResidues = await getAllResidues();
            setUserResidues(allResidues.filter(r => 
                r.companyId === generatorCompanyId && 
                r.status === 'ACTIVE' &&
                r.type.toLowerCase() === need.residueType.toLowerCase()
            ));
        }
    }
    loadResidues();
  }, [canOffer, currentUserId, role, need.residueType]);

  if (!isMounted) {
    return null; // or a skeleton loader
  }

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <CardHeader className="p-4 min-h-[7rem]">
          <Badge variant="secondary" className="w-fit mb-2">{need.category}</Badge>
          <CardTitle className="text-xl leading-snug">
              <Link href={`/dashboard/needs/${need.id}`} className="hover:text-primary transition-colors">
                {need.residueType}
              </Link>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
          <div className="space-y-3 text-sm text-muted-foreground">
              {company && (
                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span>{company.city}, {company.country}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                  <Repeat className="h-4 w-4 text-primary" />
                  <span>Necesidad {freqMap[need.frequency]}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                  <span className="font-bold text-lg text-foreground">{need.quantity} {need.unit}</span>
                  <Badge variant={company?.verificationStatus === 'VERIFIED' ? 'default' : 'outline'}>
                    {company?.name || 'Empresa'}
                  </Badge>
              </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
            <div className="w-full flex flex-col sm:flex-row gap-2">
               <Button asChild className="w-full" variant="outline">
                  <Link href={`/dashboard/needs/${need.id}`}>
                    Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
              </Button>
              {isMounted && canOffer && (
                  <Button className="w-full" onClick={() => setIsOfferDialogOpen(true)}>
                      <PackageCheck className="mr-2 h-4 w-4" /> Hacer Oferta
                  </Button>
              )}
            </div>
        </CardFooter>
      </Card>
      {isMounted && canOffer && (
        <OfferDialog
          isOpen={isOfferDialogOpen}
          onOpenChange={setIsOfferDialogOpen}
          need={need}
          userResidues={userResidues}
        />
      )}
    </>
  );
}

    