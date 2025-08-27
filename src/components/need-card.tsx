// src/components/need-card.tsx
"use client";

import Link from "next/link";
import type { Need, Residue } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Layers, MapPin, Repeat, ArrowRight, PackageCheck } from "lucide-react";
import { mockCompanies } from "@/lib/data";
import { useRole } from "@/app/dashboard/layout";
import { OfferDialog } from "./offer-dialog";
import { useState, useEffect } from "react";
import { getAllResidues } from "@/services/residue-service";

export function NeedCard({ need }: { need: Need }) {
  const company = mockCompanies.find(c => c.id === need.companyId);
  const freqMap: {[key: string]: string} = { 'ONCE': 'una vez', 'WEEKLY': 'semanal', 'MONTHLY': 'mensual' };
  const { role } = useRole();
  const [isMounted, setIsMounted] = useState(false);
  const [userResidues, setUserResidues] = useState<Residue[]>([]);
  const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);
  
  const canOffer = role === 'GENERATOR' || role === 'BOTH';
  const currentUserId = 'comp-1'; // Mock generator user

  useEffect(() => {
    setIsMounted(true);
    if (canOffer) {
        // In a real app, this would be the logged-in user's ID
        setUserResidues(getAllResidues().filter(r => r.companyId === currentUserId && r.status === 'ACTIVE'));
    }
  }, [canOffer]);

  if (!isMounted) {
    return null; // or a skeleton loader
  }

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
        <CardHeader className="p-4 min-h-[7rem]">
          <Badge variant="secondary" className="w-fit mb-2">{need.category}</Badge>
          <CardTitle className="text-xl leading-snug">
              {/* Needs don't have a detail page yet, so we won't link them for now */}
              {need.residueType}
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
          {canOffer ? (
              <Button className="w-full" onClick={() => setIsOfferDialogOpen(true)}>
                  <PackageCheck className="mr-2 h-4 w-4" /> Hacer una Oferta
              </Button>
          ) : (
              <Button className="w-full" variant="outline">
                  Ver Necesidad <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
          )}
        </CardFooter>
      </Card>
      {canOffer && (
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
