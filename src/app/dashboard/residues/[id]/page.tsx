import { mockResidues, mockCompanies } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Droplets, MapPin, Scale, TestTube2, DollarSign } from "lucide-react";
import { ResidueDetails } from "@/components/residue-details";

export default function ResiduePage({ params }: { params: { id: string } }) {
  const residue = mockResidues.find((r) => r.id === params.id);

  if (!residue) {
    notFound();
  }

  const company = mockCompanies.find((c) => c.id === residue.companyId);

  const details = [
    { icon: Scale, label: "Quantity", value: `${residue.quantity} ${residue.unit}` },
    { icon: Calendar, label: "Available From", value: new Date(residue.availabilityDate).toLocaleDateString() },
    { icon: Droplets, label: "Moisture", value: residue.moisturePct ? `${residue.moisturePct}%` : "N/A" },
    { icon: TestTube2, label: "Contaminants", value: residue.contaminants || "None" },
    { icon: MapPin, label: "Location", value: `${company?.city}, ${company?.country}` },
    { icon: DollarSign, label: "Price", value: residue.pricePerUnit ? `$${residue.pricePerUnit} / ${residue.unit}`: "Negotiable" },
  ];

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-8">
            {/* Image Carousel/Gallery */}
            <Card>
                <CardContent className="p-0">
                    <div className="relative h-96 w-full rounded-t-lg overflow-hidden">
                    <Image
                        src={residue.photos?.[0] || 'https://picsum.photos/1200/800'}
                        alt={residue.type}
                        fill
                        style={{objectFit: 'cover'}}
                        data-ai-hint="organic material"
                    />
                    </div>
                </CardContent>
            </Card>

            {/* AI Enhanced Details */}
            <ResidueDetails residue={residue} />

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
                        <CardTitle>Generator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <h3 className="font-semibold text-primary">{company.name}</h3>
                        <p className="text-sm text-muted-foreground">{company.description}</p>
                        <Badge variant={company.verificationStatus === 'VERIFIED' ? 'default' : 'destructive'} className="mt-2">
                           {company.verificationStatus}
                        </Badge>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}
