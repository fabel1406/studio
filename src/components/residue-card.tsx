// src/components/residue-card.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import type { Residue } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Calendar, ArrowRight, PackageCheck } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from "react";
import { useRole } from "@/app/dashboard/layout";


export function ResidueCard({ residue, isRecommendation = false }: { residue: Residue, isRecommendation?: boolean }) {
  const [isMounted, setIsMounted] = useState(false);
  const { role, currentUserId } = useRole();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const canRequest = (role === "TRANSFORMER" || role === "BOTH") && residue.companyId !== currentUserId;
  const aiHint = residue.type.toLowerCase().split(' ').slice(0, 2).join(' ');

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={residue.photos?.[0] || '/images/residues/placeholder.jpg'}
            alt={residue.type}
            fill
            style={{objectFit: 'cover'}}
            data-ai-hint={aiHint}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-background/80 text-foreground">
                    {residue.category}
                </Badge>
           </div>
        </div>
        <div className="p-4 min-h-[7rem]">
            <CardTitle className="text-xl leading-snug">
                <Link href={`/dashboard/residues/${residue.id}`} className="hover:text-primary transition-colors">
                    {residue.type}
                </Link>
            </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span>{residue.company?.city}, {residue.company?.country}</span>
            </div>
            <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                <span>
                  {isMounted ? `Disponible ${formatDistanceToNow(new Date(residue.availabilityDate), { addSuffix: true, locale: es })}` : `Disponible...`}
                </span>
            </div>
            <div className="flex items-center justify-between pt-2">
                <span className="font-bold text-lg text-foreground">{residue.quantity} {residue.unit}</span>
                {residue.pricePerUnit && (
                    <span className="font-semibold text-primary text-lg">${residue.pricePerUnit} / {residue.unit}</span>
                )}
            </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex flex-col sm:flex-row gap-2">
            <Button asChild className="w-full">
                <Link href={`/dashboard/residues/${residue.id}`}>
                    Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
            {isMounted && canRequest && (
                 <Button asChild variant="secondary" className="w-full">
                    <Link href={`/dashboard/residues/${residue.id}`}>
                        <PackageCheck className="mr-2 h-4 w-4" /> Solicitar
                    </Link>
                </Button>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
