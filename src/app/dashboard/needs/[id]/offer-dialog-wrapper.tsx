// src/app/dashboard/needs/[id]/offer-dialog-wrapper.tsx
"use client";

import { useState, useEffect } from "react";
import { useRole } from "../../layout";
import type { Need, Residue } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { OfferDialog } from "@/components/offer-dialog";
import { PackageCheck } from "lucide-react";
import { getAllResidues } from "@/services/residue-service";

export function OfferDialogWrapper({ need }: { need: Need }) {
    const { role, currentUserId } = useRole();
    const [isMounted, setIsMounted] = useState(false);
    const [userResidues, setUserResidues] = useState<Residue[]>([]);
    const [isOfferDialogOpen, setIsOfferDialogOpen] = useState(false);

    const canOffer = (role === 'GENERATOR' || role === 'BOTH') && need.companyId !== currentUserId;

    useEffect(() => {
        setIsMounted(true);
        if (canOffer && currentUserId) {
            const generatorCompanyId = role === 'BOTH' ? 'comp-1' : currentUserId;
            setUserResidues(getAllResidues().filter(r => 
                r.companyId === generatorCompanyId && 
                r.status === 'ACTIVE' &&
                r.type.toLowerCase() === need.residueType.toLowerCase()
            ));
        }
    }, [canOffer, currentUserId, role, need.residueType]);


    if (!isMounted || !canOffer) {
        return null;
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Hacer una Oferta</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                        Si dispones de este residuo, puedes iniciar una negociación con el solicitante.
                    </p>
                    <Button className="w-full" onClick={() => setIsOfferDialogOpen(true)}>
                        <PackageCheck className="mr-2 h-4 w-4" /> Hacer Oferta
                    </Button>
                </CardContent>
            </Card>
            <OfferDialog
                isOpen={isOfferDialogOpen}
                onOpenChange={setIsOfferDialogOpen}
                need={need}
                userResidues={userResidues}
            />
        </>
    );
}
