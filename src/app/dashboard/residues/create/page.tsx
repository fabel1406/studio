
// src/app/dashboard/residues/create/page.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { addResidue, getResidueById, updateResidue } from "@/services/residue-service"
import type { Residue } from "@/lib/types"


const residueFormSchema = z.object({
  type: z.string().min(2, { message: "El tipo debe tener al menos 2 caracteres." }),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS'], { required_error: "Debes seleccionar una categoría." }),
  quantity: z.coerce.number().min(0, { message: "La cantidad no puede ser negativa." }),
  unit: z.enum(['KG', 'TON'], { required_error: "Debes seleccionar una unidad." }),
  pricePerUnit: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
    z.number({ invalid_type_error: 'El precio debe ser un número.' }).optional()
  ),
  status: z.enum(['ACTIVE', 'RESERVED', 'CLOSED'], { required_error: "Debes seleccionar un estado." }),
  description: z.string().max(300, { message: "La descripción no puede exceder los 300 caracteres." }).optional(),
})

type ResidueFormValues = z.infer<typeof residueFormSchema>

export default function ResidueFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast()
  const [residueId, setResidueId] = useState<string | null>(null);
  const [existingResidue, setExistingResidue] = useState<Residue | null>(null);

  const form = useForm<ResidueFormValues>({
    resolver: zodResolver(residueFormSchema),
    defaultValues: {
        type: "",
        quantity: 0,
        pricePerUnit: undefined,
        description: "",
        status: 'ACTIVE',
    },
    mode: "onChange",
  })
  
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setResidueId(id);
      const residue = getResidueById(id);
      if (residue) {
        setExistingResidue(residue);
        form.reset({
          type: residue.type,
          category: residue.category,
          quantity: residue.quantity,
          unit: residue.unit,
          status: residue.status,
          pricePerUnit: residue.pricePerUnit || undefined,
          description: residue.description || "",
        });
      }
    }
  }, [searchParams, form]);


  function onSubmit(data: ResidueFormValues) {
    try {
        if (residueId && existingResidue) {
            const updatedResidueData = {
                ...existingResidue,
                ...data,
                description: data.description || '', // Ensure description is not null/undefined
            };
            updateResidue(updatedResidueData);
            toast({
                title: "¡Residuo Actualizado!",
                description: `El residuo "${data.type}" ha sido actualizado con éxito.`,
            })
        } else {
            const newResidueData = {
                ...data,
                description: data.description || '', // Ensure description is not null/undefined
                id: crypto.randomUUID(),
                companyId: 'comp-1', // Mock companyId
                availabilityDate: new Date().toISOString(),
            }
            addResidue(newResidueData);
            toast({
                title: "¡Residuo Guardado!",
                description: `El residuo "${data.type}" ha sido guardado con éxito.`,
            })
        }

        router.push('/dashboard/residues');
        router.refresh();
    } catch(e) {
        console.error("Error submitting form", e);
        toast({
            title: "Error al guardar",
            description: "Hubo un problema al guardar el residuo. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Card>
        <CardHeader>
          <CardTitle>{residueId ? "Editar Residuo" : "Publicar Nuevo Residuo"}</CardTitle>
          <CardDescription>
            {residueId
              ? "Actualiza los detalles de tu residuo."
              : "Completa los detalles a continuación para añadir un nuevo residuo a tu inventario."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tipo de Residuo</FormLabel>
                        <FormControl>
                            <Input placeholder="Ej: Alperujo" {...field} />
                        </FormControl>
                        <FormDescription>
                            El nombre específico del residuo que estás publicando.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="AGRO">Agroindustrial</SelectItem>
                            <SelectItem value="FOOD">Alimentario</SelectItem>
                            <SelectItem value="BIOMASS">Biomasa</SelectItem>
                            <SelectItem value="OTHERS">Otros</SelectItem>
                            </SelectContent>
                        </Select>
                         <FormDescription>
                            Clasifica el residuo para ayudar en la búsqueda.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Cantidad y Unidad</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                <Input type="number" placeholder="100" {...field} className="flex-1"/>
                                </FormControl>
                                <FormField
                                    control={form.control}
                                    name="unit"
                                    render={({ field: unitField }) => (
                                        <Select onValueChange={unitField.onChange} value={unitField.value} defaultValue={unitField.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-[100px]">
                                                    <SelectValue placeholder="Unidad" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="KG">KG</SelectItem>
                                                <SelectItem value="TON">TON</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <FormField
                    control={form.control}
                    name="pricePerUnit"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Precio por Unidad (Opcional)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="15.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                            Establece un precio por KG o TON. Déjalo en 0 o vacío si es negociable.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Estado</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ACTIVE">Activo</SelectItem>
                                    <SelectItem value="RESERVED">Reservado</SelectItem>
                                    <SelectItem value="CLOSED">Cerrado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                El estado actual de tu publicación de residuo.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Añade detalles adicionales sobre el residuo, como su composición, humedad, posibles contaminantes, etc."
                                className="resize-none"
                                {...field}
                                value={field.value ?? ''}
                                />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancelar
                    </Button>
                    <Button type="submit">{residueId ? "Guardar Cambios" : "Guardar Residuo"}</Button>
                </div>
                </form>
            </Form>
        </CardContent>
       </Card>
    </div>
  )
}
