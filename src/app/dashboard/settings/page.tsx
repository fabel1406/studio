// src/app/dashboard/settings/page.tsx
"use client"

import { useForm, Controller } from "react-hook-form";
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
import { useEffect } from "react";
import { useRole } from "../layout";

const profileSchema = z.object({
  companyName: z.string().min(1, "El nombre de la empresa es obligatorio."),
  email: z.string().email("El correo electrónico no es válido."),
  role: z.enum(["GENERATOR", "TRANSFORMER", "BOTH"]),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH";


export default function SettingsPage() {
    const { toast } = useToast();
    const { role, setRole } = useRole();
    
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            companyName: "Usuario Admin",
            email: "admin@ecoconnect.com",
            role: role,
        },
    });

    useEffect(() => {
        form.reset({ role });
    }, [role, form]);

    function onSubmit(values: ProfileFormValues) {
        setRole(values.role);
        toast({
            title: "Perfil Actualizado",
            description: "Tu rol ha sido cambiado a: " + values.role,
        });
    }

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Ajustes</h2>
            <p className="text-muted-foreground">
                Gestiona la configuración de tu cuenta y empresa.
            </p>

            <div className="mt-6 flex justify-center">
                <Card className="w-full max-w-lg">
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