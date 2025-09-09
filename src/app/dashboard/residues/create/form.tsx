// src/app/dashboard/residues/create/form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from "react"
import { createOrUpdateResidueAction } from "./actions";

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
import { getResidueById, getAllResidues } from "@/services/residue-service"
import { useRole } from "../../role-provider"
import { Loader2 } from "lucide-react"

// Validar que el archivo no sea mayor a 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const residueFormSchema = z.object({
  type: z.string().min(1, { message: "Debes seleccionar o especificar un tipo." }),
  customType: z.string().optional(),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS'], { required_error: "Debes seleccionar una categoría." }),
  quantity: z.coerce.number().min(0, { message: "La cantidad no puede ser negativa." }),
  unit: z.enum(['KG', 'TON'], { required_error: "Debes seleccionar una unidad." }),
  pricePerUnit: z.preprocess(
    (val) => (val === "" || val === null || val === undefined) ? null : Number(val),
    z.coerce.number({ invalid_type_error: "El precio debe ser un número." }).optional().nullable()
  ),
  status: z.enum(['ACTIVE', 'RESERVED', 'CLOSED'], { required_error: "Debes seleccionar un estado." }),
  description: z.string().max(300, { message: "La descripción no puede exceder los 300 caracteres." }).optional(),
  photoFile: z
    .any()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `El tamaño máximo es de 5MB.`)
    .refine(file => !file || file.type?.startsWith("image/"), "Solo se aceptan archivos .jpg, .jpeg, .png y .webp."),
}).refine(data => {
    if (data.type === 'Otro' && (!data.customType || data.customType.length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifica un tipo con al menos 2 caracteres.",
    path: ["customType"],
});

type ResidueFormValues = z.infer<typeof residueFormSchema>

const defaultFormValues: Omit<ResidueFormValues, 'photoFile' | 'category'> & { category: ResidueFormValues['category'] | undefined } = {
    type: "",
    customType: "",
    quantity: 0,
    pricePerUnit: undefined,
    description: "",
    status: 'ACTIVE',
    unit: 'TON',
    category: undefined,
};

export default function ResidueForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast()
  const [isPending, startTransition] = useTransition();
  const [residueId, setResidueId] = useState<string | null>(null);
  const { companyId } = useRole();
  const [uniqueResidueTypes, setUniqueResidueTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | undefined>(undefined);

   useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        try {
            const allResidues = await getAllResidues();
            const types = [...new Set(allResidues.map(r => r.type))];
            setUniqueResidueTypes(types);

            const id = searchParams.get('id');
            if (id) {
                setResidueId(id);
                const residue = await getResidueById(id);
                if (residue) {
                    const isStandardType = types.includes(residue.type);
                    setExistingPhotoUrl(residue.photos?.[0]);
                    form.reset({
                        type: isStandardType ? residue.type : 'Otro',
                        customType: isStandardType ? '' : residue.type,
                        category: residue.category,
                        quantity: residue.quantity,
                        unit: residue.unit,
                        status: residue.status,
                        pricePerUnit: residue.pricePerUnit,
                        description: residue.description || "",
                    });
                }
            } else {
              form.reset(defaultFormValues);
              setExistingPhotoUrl(undefined);
            }
        } catch (error) {
            console.error("Error fetching initial data", error);
            toast({ title: "Error", description: "No se pudieron cargar los datos iniciales.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [searchParams]);

  const form = useForm<ResidueFormValues>({
    resolver: zodResolver(residueFormSchema),
    defaultValues: defaultFormValues,
    mode: "onChange",
  })

  const selectedResidueType = form.watch("type");

  async function onSubmit(data: ResidueFormValues) {
    if (!companyId) {
      toast({ 
        title: "Error de autenticación", 
        description: "No se ha podido identificar tu empresa.", 
        variant: "destructive" 
      });
      return;
    }
    setIsSubmitting(true);

    const formData = new FormData();
    if (residueId) {
        formData.append('residueId', residueId);
    }
    formData.append('type', data.type);
    if(data.type === 'Otro' && data.customType) {
        formData.append('customType', data.customType);
    }
    formData.append('category', data.category);
    formData.append('quantity', String(data.quantity));
    formData.append('unit', data.unit);
    if (data.pricePerUnit !== undefined && data.pricePerUnit !== null) {
      formData.append('pricePerUnit', String(data.pricePerUnit));
    }
    formData.append('status', data.status);
    if (data.description) {
        formData.append('description', data.description);
    }
    if (data.photoFile) {
        formData.append('photoFile', data.photoFile);
    }

    try {
        const result = await createOrUpdateResidueAction(formData);

        if (result.error) {
            toast({
                title: 'Error al guardar',
                description: result.error,
                variant: 'destructive',
            });
        } else {
            toast({
                title: residueId ? "¡Residuo Actualizado!" : "¡Residuo Creado!",
                description: `El residuo ha sido guardado con éxito.`,
            });
             startTransition(() => {
                router.push('/dashboard/residues');
             });
        }
    } catch (e) {
        toast({
            title: 'Error Inesperado',
            description: 'Ocurrió un problema al procesar tu solicitud.',
            variant: 'destructive',
        });
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Card>
        <CardHeader>
          <CardTitle>{residueId ? "Editar Publicación" : "Publicar Nuevo Residuo"}</CardTitle>
          <CardDescription>
            {residueId
              ? "Actualiza los detalles de tu publicación en el marketplace."
              : "Completa los detalles a continuación para añadir un nuevo residuo al marketplace."
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
                          <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                              <FormControl>
                              <SelectTrigger>
                                  <SelectValue placeholder="Selecciona un tipo de residuo" />
                              </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                  {uniqueResidueTypes.map(type => (
                                      <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                  <SelectItem value="Otro">Otro (especificar)</SelectItem>
                              </SelectContent>
                          </Select>
                          <FormDescription>
                              El nombre específico del residuo que estás publicando.
                          </FormDescription>
                          <FormMessage />
                          </FormItem>
                      )}
                    />

                    {selectedResidueType === 'Otro' && (
                        <FormField
                        control={form.control}
                        name="customType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Especificar tipo de residuo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ej: Poda de cítricos" {...field} value={field.value ?? ''} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    )}


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
                                <Input type="number" placeholder="100" {...field} />
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
                            <Input type="number" step="0.01" placeholder="15.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormDescription>
                            Establece un precio por KG o TON. Déjalo vacío si es negociable.
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                     <div className="md:col-span-2">
                      <FormField
                          control={form.control}
                          name="photoFile"
                          render={({ field }) => (
                              <FormItem>
                              <FormLabel>Foto del Residuo</FormLabel>
                               <FormControl>
                                  <Input 
                                    type="file" 
                                    accept="image/png, image/jpeg, image/jpg, image/webp" 
                                    onChange={(e) => field.onChange(e.target.files?.[0] ?? null)}
                                    disabled={isSubmitting} 
                                  />
                              </FormControl>
                               <FormDescription>
                                  {existingPhotoUrl ? "Sube una nueva imagen para reemplazar la actual." : "Sube una imagen clara de tu residuo (Max. 5MB)."}
                              </FormDescription>
                              <FormMessage />
                              </FormItem>
                          )}
                          />
                    </div>
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
                </div>
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => router.push('/dashboard/residues')}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isSubmitting || isPending}>
                        {(isSubmitting || isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}
                        {residueId ? "Guardar Cambios" : "Guardar Residuo"}
                    </Button>
                </div>
                </form>
            </Form>
        </CardContent>
       </Card>
    </div>
  )
}
