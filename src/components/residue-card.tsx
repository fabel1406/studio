import Link from "next/link";
import Image from "next/image";
import type { Residue } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';


export function ResidueCard({ residue }: { residue: Residue }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={residue.photos?.[0] || 'https://picsum.photos/600/400'}
            alt={residue.type}
            fill
            style={{objectFit: 'cover'}}
            data-ai-hint="residuo organico"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
           <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-background/80 text-foreground">
                    {residue.category}
                </Badge>
           </div>
        </div>
        <div className="p-4">
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
                <span>Disponible {formatDistanceToNow(new Date(residue.availabilityDate), { addSuffix: true, locale: es })}</span>
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
        <Button asChild className="w-full">
            <Link href={`/dashboard/residues/${residue.id}`}>
                Ver Detalles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
