
"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";

const profileSchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  email: z.string().email("El correo electrónico no es válido."),
  role: z.enum(["GENERATOR", "TRANSFORMER", "BOTH"]),
});

export default function SettingsPage() {
    const { toast } = useToast();

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            companyName: "Usuario Admin",
            email: "admin@ecoconnect.com",
            role: "GENERATOR",
        },
    });

    function onSubmit(values: z.infer<typeof profileSchema>) {
        console.log(values);
        toast({
            title: "Perfil Actualizado",
            description: "Tu información ha sido guardada con éxito.",
        });
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
            <p className="text-muted-foreground">
                Gestiona la configuración de tu cuenta y empresa.
            </p>

            <Separator className="my-6"/>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Perfil de la Empresa</CardTitle>
                            <CardDescription>
                                Actualiza la información de tu empresa.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    <FormField
                                    control={form.control}
                                    name="companyName"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Nombre de la Empresa</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tu empresa" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Correo Electrónico</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="nombre@ejemplo.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <FormField
                                    control={form.control}
                                    name="role"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Rol Principal</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona tu rol" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="GENERATOR">Generador</SelectItem>
                                                <SelectItem value="TRANSFORMER">Transformador</SelectItem>
                                                <SelectItem value="BOTH">Ambos</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit">Guardar Cambios</Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>

                <div className="md:col-span-2 space-y-8">
                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Residuos que Genero</CardTitle>
                                <CardDescription>
                                    Añade o edita los tipos de residuos que tu empresa produce.
                                </CardDescription>
                            </div>
                            <Button>
                                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Tipo
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Aún no has añadido ningún tipo de residuo.</p>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Residuos que Transformo</CardTitle>
                                <CardDescription>
                                    Especifica los residuos que tu empresa puede procesar.
                                </CardDescription>
                            </div>
                             <Button>
                                <PlusCircle className="mr-2h-4 w-4" /> Añadir Tipo
                            </Button>
                        </CardHeader>
                        <CardContent>
                             <p className="text-sm text-muted-foreground">Aún no has añadido ninguna capacidad de transformación.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>

        </div>
    );
}
