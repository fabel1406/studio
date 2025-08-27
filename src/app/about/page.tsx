// src/app/about/page.tsx

import PublicLayout from "@/app/(public)/layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

const teamMembers = [
    { name: 'Ana García', role: 'CEO y Fundadora', image: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { name: 'Carlos Rodríguez', role: 'Director de Tecnología (CTO)', image: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
    { name: 'Laura Martínez', role: 'Directora de Sostenibilidad', image: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
    { name: 'David Fernández', role: 'Jefe de Desarrollo de Negocio', image: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
];

const values = [
    { title: 'Sostenibilidad', description: 'Creemos en un futuro donde los negocios prosperan respetando el planeta.' },
    { title: 'Innovación', description: 'Aplicamos la tecnología para resolver desafíos ambientales complejos.' },
    { title: 'Colaboración', description: 'Fomentamos una comunidad de empresas que trabajan juntas por un objetivo común.' },
    { title: 'Transparencia', description: 'Construimos confianza a través de la comunicación abierta y la trazabilidad.' },
];

export default function AboutPage() {
    return (
        <PublicLayout>
            <div className="bg-background text-foreground">
                {/* Hero Section */}
                <section className="relative pt-16 pb-24 sm:pt-24 sm:pb-32 lg:pt-32 lg:pb-40 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="text-center">
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                                Nuestra Misión:
                                <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-green-500 to-secondary">
                                    Revalorizar Cada Residuo
                                </span>
                            </h1>
                            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                                En EcoConnect, estamos dedicados a transformar el paradigma de los residuos. Creemos que cada subproducto industrial es un recurso potencial, y nuestra plataforma está diseñada para conectar a los visionarios que comparten esta creencia.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Our Story Section */}
                <section className="py-20 sm:py-28">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-1 gap-12 items-center">
                            <div className="order-2 md:order-1">
                                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">La Historia de EcoConnect</h2>
                                <p className="mt-4 text-muted-foreground text-justify">
                                    Nacimos de la simple observación de una ineficiencia masiva: por un lado, empresas generando toneladas de residuos orgánicos con un alto coste de gestión; por otro, industrias buscando materias primas sostenibles y asequibles. Vimos una desconexión, y la tecnología nos dio la herramienta para construir el puente.
                                </p>
                                <p className="mt-4 text-muted-foreground text-justify">
                                    EcoConnect comenzó como un proyecto para optimizar la logística de residuos en la industria agroalimentaria. Rápidamente, nos dimos cuenta del potencial para crear un verdadero marketplace B2B, un ecosistema donde la economía circular no fuera solo un concepto, sino una realidad rentable y escalable. Hoy, nuestra plataforma impulsa la innovación y la sostenibilidad en múltiples sectores.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Our Values Section */}
                 <section className="py-20 sm:py-28 bg-card dark:bg-card/50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold">Nuestros Valores Fundamentales</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Estos principios guían cada decisión que tomamos y cada línea de código que escribimos.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value) => (
                                <div key={value.title} className="text-center">
                                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 text-primary mb-4">
                                        <CheckCircle className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold">{value.title}</h3>
                                    <p className="mt-2 text-muted-foreground">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-20 sm:py-28">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto">
                            <h2 className="text-3xl sm:text-4xl font-bold">Conoce al Equipo</h2>
                            <p className="mt-4 text-lg text-muted-foreground">
                                Somos un grupo de ingenieros, ecologistas y emprendedores apasionados por crear un impacto positivo.
                            </p>
                        </div>
                        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                            {teamMembers.map((member) => (
                                <Card key={member.name} className="text-center overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                    <CardContent className="p-0">
                                        <Avatar className="w-full h-48 rounded-none">
                                            <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="p-4">
                                            <h3 className="text-lg font-semibold text-foreground">{member.name}</h3>
                                            <p className="text-sm text-primary">{member.role}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        </PublicLayout>
    );
}