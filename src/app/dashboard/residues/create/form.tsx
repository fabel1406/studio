// src/app/dashboard/residues/create/form.tsx
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
import type { Residue } from "@/lib/types"
import { getResidueById, addResidue, updateResidue, getAllResidues } from "@/services/residue-service"
import { getAllCountries, getCitiesByCountry } from "@/lib/locations";
import { useRole } from "../../role-provider"
import { Loader2 } from "lucide-react"

const allCountries = getAllCountries();

const residueFormSchema = z.object({
  type: z.string().min(1, { message: "Debes seleccionar o especificar un tipo." }),
  customType: z.string().optional(),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS'], { required_error: "Debes seleccionar una categoría." }),
  quantity: z.coerce.number().min(0, { message: "La cantidad no puede ser negativa." }),
  unit: z.enum(['KG', 'TON'], { required_error: "Debes seleccionar una unidad." }),
  pricePerUnit: z.preprocess(
    (val) => (val === "" || val === null || val === undefined) ? undefined : Number(val),
    z.coerce.number({ invalid_type_error: "El precio debe ser un número." }).optional()
  ),
  status: z.enum(['ACTIVE', 'RESERVED', 'CLOSED'], { required_error: "Debes seleccionar un estado." }),
  description: z.string().max(300, { message: "La descripción no puede exceder los 300 caracteres." }).optional(),
  country: z.string().min(1, "El país es obligatorio."),
  city: z.string().min(1, "La ciudad es obligatoria."),
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

export default function ResidueForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast()
  const [residueId, setResidueId] = useState<string | null>(null);
  const { companyId } = useRole();
  const [uniqueResidueTypes, setUniqueResidueTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const allResidues = await getAllResidues();
        const types = [...new Set(allResidues.map(r => r.type))];
        setUniqueResidueTypes(types);

        const id = searchParams.get('id');
        if (id) {
          setResidueId(id);
          const residue = await getResidueById(id);
          if (residue) {
            const isStandardType = types.includes(residue.type);
            form.reset({
              type: isStandardType ? residue.type : 'Otro',
              customType: isStandardType ? '' : residue.type,
              category: residue.category,
              quantity: residue.quantity,
              unit: residue.unit,
              status: residue.status,
              pricePerUnit: residue.pricePerUnit,
              description: residue.description || "",
              country: residue.company?.country || 'España',
              city: residue.company?.city || '',
            });
          }
        }
        setIsLoading(false);
    }
    fetchData();
  }, [searchParams]);

  const form = useForm<ResidueFormValues>({
    resolver: zodResolver(residueFormSchema),
    defaultValues: {
        type: "",
        customType: "",
        quantity: 0,
        pricePerUnit: undefined,
        description: "",
        status: 'ACTIVE',
        unit: 'TON',
        category: undefined,
        country: "España",
        city: "",
    },
    mode: "onChange",
  })

  const selectedResidueType = form.watch("type");
  const selectedCountry = form.watch("country");
  const citiesForSelectedCountry = getCitiesByCountry(selectedCountry);
  
  useEffect(() => {
    if(!form.formState.isDirty) return;
    form.setValue('city', '');
  }, [selectedCountry, form]);


  async function onSubmit(data: ResidueFormValues) {
    if (!companyId) {
      toast({ 
        title: "Error de autenticación", 
        description: "No se ha podido identificar tu empresa. Por favor, recarga la página o inicia sesión de nuevo.", 
        variant: "destructive" 
      });
      return;
    }

    try {
        const finalData = {
          companyId,
          type: data.type === 'Otro' ? data.customType! : data.type,
          category: data.category,
          quantity: data.quantity,
          unit: data.unit,
          pricePerUnit: data.pricePerUnit,
          status: data.status,
          description: data.description,
        };

        if (residueId) {
            await updateResidue({ ...finalData, id: residueId });
            toast({
                title: "¡Residuo Actualizado!",
                description: `El residuo "${finalData.type}" ha sido actualizado con éxito.`,
            })
        } else {
            await addResidue(finalData as any);
            toast({
                title: "¡Residuo Guardado!",
                description: `El residuo "${finalData.type}" ha sido guardado con éxito.`,
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
                    <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>País de Origen del Residuo</FormLabel>
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
                    <Button type="button" variant="outline" onClick={() => router.push('/dashboard/residues')}>
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
