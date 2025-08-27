
"use client";

import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { UserResidue } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const predefinedResidues = [
    "Alperujo",
    "Bagazo de cerveza",
    "Cáscaras de frutas",
    "Cáscaras de frutos secos",
    "Estiércol",
    "Hoja de olivo",
    "Lodos de depuradora",
    "Paja",
    "Poda de viñedos (Sarmientos)",
    "Poda de frutales",
    "Posos de café",
    "Restos de hortalizas",
    "Serrín y virutas de madera",
    "Suero lácteo",
];

const formSchema = z.object({
  residue: z.string().min(1, "Debes seleccionar o escribir un residuo."),
  customResidue: z.string().optional(),
}).refine(data => {
    if (data.residue === 'other' && (!data.customResidue || data.customResidue.trim() === '')) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifica el nombre del residuo.",
    path: ["customResidue"],
});

type FormValues = z.infer<typeof formSchema>;

interface AddResidueDialogProps {
    children: React.ReactNode;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddResidue: (residue: UserResidue) => void;
    title: string;
    description: string;
}

export function AddResidueDialog({ children, open, onOpenChange, onAddResidue, title, description }: AddResidueDialogProps) {
    const { toast } = useToast();
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            residue: "",
            customResidue: "",
        },
    });

    const selectedResidue = form.watch("residue");

    function onSubmit(values: FormValues) {
        const residueName = values.residue === 'other' ? values.customResidue : values.residue;

        if (residueName) {
            onAddResidue({
                id: crypto.randomUUID(),
                name: residueName,
            });
            toast({
                title: "Residuo Añadido",
                description: `Se ha añadido "${residueName}" a tu lista.`,
            });
            onOpenChange(false);
            form.reset();
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="residue"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tipo de Residuo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecciona un tipo de residuo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {predefinedResidues.map(res => (
                                                <SelectItem key={res} value={res}>{res}</SelectItem>
                                            ))}
                                            <SelectItem value="other">Otro (especificar)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {selectedResidue === 'other' && (
                            <FormField
                                control={form.control}
                                name="customResidue"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre del Residuo Personalizado</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ej: Bagazo de cerveza" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter>
                            <Button type="submit">Añadir a la lista</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
