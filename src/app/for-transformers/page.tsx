// src/app/for-transformers/page.tsx
import PublicLayout from "@/app/(public)/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Recycle, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const benefits = [
    { 
        icon: Package, 
        title: "Acceso a Materia Prima", 
        description: "Encuentra un flujo constante y diverso de residuos orgánicos para tus procesos de transformación, desde biomasa hasta subproductos agroindustriales." 
    },
    { 
        icon: Recycle, 
        title: "Optimización de Costes", 
        description: "Reduce tus costes de adquisición de materia prima accediendo a recursos locales a precios competitivos. Negocia directamente con los generadores para obtener los mejores tratos." 
    },
    { 
        icon: ShieldCheck, 
        title: "Calidad y Trazabilidad", 
        description: "Conecta con generadores verificados que proporcionan información detallada sobre la composición y calidad de sus residuos, asegurando la idoneidad para tus procesos." 
    },
];

const steps = [
  {
    number: "01",
    title: "Busca o Publica tu Necesidad",
    description: "Explora el marketplace en busca de los residuos que necesitas o publica una 'necesidad' para que los generadores te encuentren y te hagan ofertas."
  },
  {
    number: "02",
    title: "Solicita y Negocia",
    description: "Contacta directamente con los generadores para solicitar muestras, negociar precios y acordar las condiciones de entrega y logística."
  },
  {
    number: "03",
    title: "Asegura tu Suministro",
    description: "Cierra acuerdos a corto o largo plazo para garantizar un suministro constante y fiable de materia prima, impulsando tu producción de forma sostenible."
  }
];

export default function ForTransformersPage() {
  return (
    <PublicLayout>
      <div className="bg-background text-foreground">
        {/* Hero Section */}
        <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  Asegura tu Materia Prima 
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-secondary">
                    Sostenible
                  </span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                  EcoConnect es tu fuente directa de materias primas secundarias. Accede a un mercado B2B de residuos orgánicos, optimiza tu cadena de suministro y lidera la innovación en la economía circular.
                </p>
                <div className="mt-8 sm:mt-10 flex gap-4">
                  <Button asChild size="lg" className="text-lg py-7 px-8">
                    <Link href="/dashboard/marketplace">Explorar Marketplace</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <Image
                  src="/images/residues/poda-olivo.jpg"
                  alt="Planta de biogás"
                  width={800}
                  height={600}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="industria energia"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 sm:py-28 bg-card dark:bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold">Potencia tu Transformación</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Descubre las ventajas de usar EcoConnect como tu principal fuente de aprovisionamiento.
              </p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit) => (
                <Card key={benefit.title} className="text-center shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-2 p-6">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                    <benefit.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="mt-2 text-muted-foreground">{benefit.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 sm:py-28">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-bold">Consigue lo que Necesitas en 3 Pasos</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Nuestro proceso está diseñado para que encuentres y adquieras la materia prima que necesitas de forma eficiente.
                    </p>
                </div>
                <div className="mt-20 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" aria-hidden="true"></div>
                    {steps.map((step, index) => (
                        <div key={step.number} className={`relative flex items-center mb-16 md:mb-24 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full bg-card border-2 border-primary text-primary font-bold text-3xl flex-shrink-0 z-10">
                                {step.number}
                            </div>
                            <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12'}`}>
                                <Card className="p-8 shadow-xl">
                                    <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </Card>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

      </div>
    </PublicLayout>
  );
}
