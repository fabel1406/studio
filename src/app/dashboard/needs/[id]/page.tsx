// src/app/dashboard/needs/[id]/page.tsx
import { getNeedById } from "@/services/need-service";
import { mockCompanies } from "@/lib/data";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Layers, MapPin, Repeat, Mail, Phone, Globe, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OfferDialogWrapper } from "./offer-dialog-wrapper";

export default function NeedDetailsPage({ params }: { params: { id: string } }) {
  const need = getNeedById(params.id);

  if (!need) {
    notFound();
  }

  const company = mockCompanies.find((c) => c.id === need.companyId);
  const freqMap: {[key: string]: string} = { 'ONCE': 'Solo una vez', 'WEEKLY': 'Semanalmente', 'MONTHLY': 'Mensualmente' };

  const details = [
    { icon: Layers, label: "Categoría", value: need.category },
    { icon: Calendar, label: "Frecuencia", value: freqMap[need.frequency] },
    { icon: PackageCheck, label: "Cantidad", value: `${need.quantity} ${need.unit}` },
    { icon: MapPin, label: "Ubicación", value: `${company?.city}, ${company?.country}` },
  ];

  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-8">
            <Card>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{need.category}</Badge>
                <CardTitle className="text-3xl">{need.residueType}</CardTitle>
                <CardDescription>
                  Publicado por <Link href="#" className="text-primary hover:underline">{company?.name}</Link>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">Especificaciones y Detalles</h3>
                <p className="text-muted-foreground">
                  {need.specifications || "No se han proporcionado especificaciones adicionales para esta necesidad."}
                </p>
              </CardContent>
            </Card>
             <Card>
                 <CardHeader>
                    <CardTitle>Detalles de la Necesidad</CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {details.map(item => (
                            <li key={item.label} className="flex items-center gap-4">
                                <div className="flex-shrink-0 bg-primary/10 text-primary p-2 rounded-lg">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">{item.label}</p>
                                    <p className="font-medium text-foreground">{item.value}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

          </div>

          <div className="md:col-span-1 space-y-6">
            {company && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Información del Solicitante</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-primary">{company.name}</h3>
                            <p className="text-sm text-muted-foreground">{company.description}</p>
                             <Badge variant={company.verificationStatus === 'VERIFIED' ? 'default' : 'destructive'} className="mt-2">
                                {company.verificationStatus === 'VERIFIED' ? 'VERIFICADO' : 'PENDIENTE'}
                            </Badge>
                        </div>
                        <div className="space-y-2">
                           {company.contactEmail && (
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <a href={`mailto:${company.contactEmail}`} className="text-sm text-primary hover:underline">{company.contactEmail}</a>
                                </div>
                            )}
                             {company.phone && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{company.phone}</span>
                                </div>
                            )}
                            {company.website && (
                                <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                                       Sitio Web
                                    </a>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            <OfferDialogWrapper need={need} />
          </div>
        </div>
      </div>
    </>
  );
}
