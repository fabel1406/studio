// src/app/dashboard/companies/[id]/page.tsx
import { notFound } from "next/navigation";
import { getCompanyById } from "@/services/company-service";
import { getAllResidues } from "@/services/residue-service";
import { getAllNeeds } from "@/services/need-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Globe, Mail, MapPin, Phone, CheckCircle, Package, List } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResidueCard } from "@/components/residue-card";
import { NeedCard } from "@/components/need-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ✅ Props correctos para App Router
type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function CompanyProfilePage({ params }: Props) {
  const company = getCompanyById(params.id);

  if (!company) {
    notFound();
  }

  const companyResidues = getAllResidues().filter(
    (r) => r.companyId === company.id && r.status === "ACTIVE"
  );
  const companyNeeds = getAllNeeds().filter(
    (n) => n.companyId === company.id && n.status === "ACTIVE"
  );

  return (
    <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <Avatar className="h-24 w-24 border-2 border-primary">
              <AvatarFallback className="text-3xl bg-muted">
                {company.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-4">
              <CardTitle className="text-3xl">{company.name}</CardTitle>
              <Badge
                variant={
                  company.verificationStatus === "VERIFIED"
                    ? "default"
                    : "destructive"
                }
                className="h-fit"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {company.verificationStatus === "VERIFIED"
                  ? "Verificada"
                  : "Pendiente de Verificación"}
              </Badge>
            </div>
            <CardDescription className="mt-2 text-base">
              {company.description ||
                "Esta empresa aún no ha añadido una descripción."}
            </CardDescription>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>
                  {company.city}, {company.country}
                </span>
              </div>
              {company.contactEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <a
                    href={`mailto:${company.contactEmail}`}
                    className="hover:text-primary"
                  >
                    {company.contactEmail}
                  </a>
                </div>
              )}
              {company.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{company.phone}</span>
                </div>
              )}
              {company.website && (
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    {company.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="residues" className="w-full">
        <TabsList className="grid grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto">
          <TabsTrigger value="residues">
            <List className="mr-2 h-4 w-4" />
            Residuos Ofertados ({companyResidues.length})
          </TabsTrigger>
          <TabsTrigger value="needs">
            <Package className="mr-2 h-4 w-4" />
            Necesidades Publicadas ({companyNeeds.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="residues">
          {companyResidues.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {companyResidues.map((residue) => (
                <ResidueCard key={residue.id} residue={residue} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <h3 className="text-xl font-semibold">
                Esta empresa no tiene residuos activos
              </h3>
              <p>Vuelve más tarde para ver nuevas oportunidades.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="needs">
          {companyNeeds.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6">
              {companyNeeds.map((need) => (
                <NeedCard key={need.id} need={need} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground">
              <h3 className="text-xl font-semibold">
                Esta empresa no tiene necesidades publicadas
              </h3>
              <p>
                Actualmente no están buscando ningún residuo específico.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
