// src/app/dashboard/settings/page.tsx
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
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useRole } from "../role-provider";
import { Textarea } from "@/components/ui/textarea";
import { getAllCountries, getCitiesByCountry, type City } from "@/lib/locations";
import { useRouter } from "next/navigation";

const allCountries = getAllCountries();

const profileSchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  email: z.string().email("El correo electrónico no es válido."),
  role: z.enum(["GENERATOR", "TRANSFORMER", "BOTH"]),
  description: z.string().max(200, "La descripción no puede exceder los 200 caracteres.").optional(),
  country: z.string().min(1, "El país es obligatorio."),
  city: z.string().min(1, "La ciudad es obligatoria."),
  address: z.string().min(1, "La dirección es obligatoria."),
  contactEmail: z.string().email("El correo de contacto no es válido.").optional().or(z.literal('')),
  phone: z.string().max(20, "El teléfono no puede exceder los 20 caracteres.").optional(),
  website: z.string().url("La URL del sitio web no es válida.").optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function SettingsPage() {
    const { toast } = useToast();
    const router = useRouter();
    const { user, role, setRole } = useRole();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            companyName: "Usuario EcoConnect",
            email: "",
            description: "Empresa de la plataforma EcoConnect.",
            country: "España",
            city: "Madrid",
            address: "Calle Ficticia 123",
            contactEmail: "",
            phone: "+34 123 456 789",
            website: "https://www.ecoconnect.com",
            role: role,
        },
    });

    const selectedCountry = form.watch("country");
    const citiesForSelectedCountry = getCitiesByCountry(selectedCountry);

    useEffect(() => {
        if (user) {
            form.reset({
                ...form.getValues(),
                email: user.email || '',
                companyName: user.displayName || 'Usuario EcoConnect',
                role,
            });
        }
    }, [role, user, form]);

    useEffect(() => {
        if (form.formState.isDirty) {
            form.setValue('city', '');
        }
    }, [selectedCountry, form]);


    function onSubmit(values: ProfileFormValues) {
        setRole(values.role);
        localStorage.setItem('userRole', values.role); // Persist role change for this demo
        console.log("Saving profile data:", values);
        toast({
            title: "Perfil Actualizado",
            description: "La información de tu empresa ha sido guardada.",
        });
        router.refresh();
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
            <p className="text-muted-foreground">
                Gestiona la configuración de tu cuenta y empresa.
            </p>

            <div className="mt-6 flex justify-center">
                <Card className="w-full max-w-2xl">
                    <CardHeader>
                        <CardTitle>Perfil de la Empresa</CardTitle>
                        <CardDescription>
                            Actualiza la información de tu empresa. Esta información será visible para otros usuarios en el marketplace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                <FormLabel>Correo (Inicio de Sesión)</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="nombre@ejemplo.com" {...field} disabled />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Descripción Breve</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Describe brevemente tu empresa..." {...field} value={field.value ?? ''} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="country"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>País</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona un país" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {allCountries.map((country) => (
                                                            <SelectItem key={country.code} value={country.name}>{country.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                     <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ciudad</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value} disabled={!selectedCountry}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una ciudad" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {citiesForSelectedCountry.map((city) => (
                                                            <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dirección</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Calle, número, código postal" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="contactEmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email de Contacto Público</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="contacto@empresa.com" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Teléfono</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="+34 123 456 789" {...field} value={field.value ?? ''} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sitio Web</FormLabel>
                                            <FormControl>
                                                <Input placeholder="https://www.tuempresa.com" {...field} value={field.value ?? ''} />
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
                                            <Select onValueChange={field.onChange} value={field.value}>
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
        </div>
    );
}

    