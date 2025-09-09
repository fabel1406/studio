import { getResidueById } from "@/services/residue-service";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Droplets, MapPin, Scale, TestTube2, DollarSign, Mail, Phone, Globe } from "lucide-react";
import { ResidueActionPanel } from "@/components/residue-action-panel";
import { AnalysisPanel } from "@/components/analysis-panel";
import { getCompanyById } from "@/services/company-service";

export default async function ResiduePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const residue = await getResidueById(id);

  if (!residue) {
    notFound();
  }

  const company = await getCompanyById(residue.companyId);

  const details = [
    { icon: Scale, label: "Cantidad", value: `${residue.quantity} ${residue.unit}` },
    { icon: Calendar, label: "Disponible Desde", value: new Date(residue.availabilityDate).toLocaleDateString() },
    { icon: Droplets, label: "Humedad", value: residue.moisturePct ? `${residue.moisturePct}%` : "N/A" },
    { icon: TestTube2, label: "Contaminantes", value: residue.contaminants || "Ninguno" },
    { icon: MapPin, label: "Ubicación", value: `${company?.city}, ${company?.country}` },
    { icon: DollarSign, label: "Precio", value: residue.pricePerUnit ? `$${residue.pricePerUnit} / ${residue.unit}`: "Negociable" },
  ];

  const aiHint = residue.type.toLowerCase().split(' ').slice(0, 2).join(' ');
  const imagePath = residue.photos?.[0] || "/images/residues/placeholder.jpg";

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            {/* Image Carousel/Gallery */}
            <Card>
                <CardContent className="p-0">
                    <div className="relative h-96 w-full rounded-t-lg overflow-hidden">
                    <Image
                        src={imagePath}
                        alt={residue.type}
                        fill
                        style={{objectFit: 'cover'}}
                        data-ai-hint={aiHint}
                        priority
                    />
                    </div>
                </CardContent>
            </Card>

            {/* AI Enhanced Details */}
            <AnalysisPanel item={residue} type="residue" />

        </div>

        <div className="md:col-span-1 space-y-6">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-2xl">{residue.type}</CardTitle>
                    <Badge variant="secondary" className="w-fit">{residue.category}</Badge>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
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

            {company && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Información del Generador</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Link href={`/dashboard/companies/${company.id}`} className="font-semibold text-primary hover:underline">
                              <h3>{company.name}</h3>
                            </Link>
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

             <ResidueActionPanel residue={residue} />
        </div>
      </div>
    </div>
  );
}
