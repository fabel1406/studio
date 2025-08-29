// src/app/for-generators/page.tsx
import PublicLayout from "@/app/(public)/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, DollarSign, Leaf, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const benefits = [
    { 
        icon: DollarSign, 
        title: "Nuevas Fuentes de Ingresos", 
        description: "Transforma lo que antes era un coste de gestión en una nueva línea de beneficios para tu empresa. Vende tus subproductos a una red de compradores verificados." 
    },
    { 
        icon: Leaf, 
        title: "Sostenibilidad y Cumplimiento", 
        description: "Mejora la huella de carbono de tu empresa, cumple con tus objetivos de ESG (Environmental, Social, and Governance) y fortalece tu imagen de marca como líder en economía circular." 
    },
    { 
        icon: Zap, 
        title: "Logística Eficiente", 
        description: "Nuestra plataforma simplifica la conexión y negociación con empresas transformadoras, reduciendo el tiempo y esfuerzo dedicado a encontrar salidas para tus residuos." 
    },
];

const steps = [
  {
    number: "01",
    title: "Publica tu Residuo",
    description: "Crea una publicación detallada de tu residuo en minutos. Añade fotos, cantidad, ubicación y composición para atraer a los compradores adecuados."
  },
  {
    number: "02",
    title: "Recibe Solicitudes y Ofertas",
    description: "Los transformadores interesados te contactarán directamente a través de la plataforma. Gestiona todas tus negociaciones en un solo lugar."
  },
  {
    number: "03",
    title: "Cierra el Trato",
    description: "Acuerda los términos de precio, logística y entrega de forma segura. Valoriza tus residuos y contribuye a un ciclo productivo más sostenible."
  }
];

export default function ForGeneratorsPage() {
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
                  Maximiza el Valor de tus 
                  <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-secondary">
                    Subproductos
                  </span>
                </h1>
                <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl">
                  En EcoConnect, te proporcionamos las herramientas para convertir tus residuos orgánicos en activos valiosos. Conecta con una red de empresas listas para transformar tus subproductos en nuevos recursos.
                </p>
                <div className="mt-8 sm:mt-10 flex gap-4">
                  <Button asChild size="lg" className="text-lg py-7 px-8">
                    <Link href="/register">Publica tu Residuo</Link>
                  </Button>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <Image
                  src="https://picsum.photos/seed/agriculture-industry/800/600"
                  alt="Materia orgánica siendo procesada"
                  width={800}
                  height={600}
                  className="rounded-xl shadow-2xl"
                  data-ai-hint="industria agricultura"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 sm:py-28 bg-card dark:bg-card/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold">Beneficios para tu Empresa</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Descubre por qué cientos de generadores eligen EcoConnect para revalorizar sus residuos.
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
                    <h2 className="text-3xl sm:text-4xl font-bold">Simple, Rápido y Eficaz</h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Comenzar a vender tus residuos es un proceso de tres sencillos pasos.
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
