// src/app/dashboard/needs/create/form.tsx
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
import { addNeed, getNeedById, updateNeed } from "@/services/need-service"
import { getAllCountries, getCitiesByCountry } from "@/lib/locations"
import { useRole } from "../../role-provider"
import { getAllResidues } from "@/services/residue-service"
import { Loader2 } from "lucide-react"

const allCountries = getAllCountries();

const needFormSchema = z.object({
  residueType: z.string({ required_error: "Debes seleccionar un tipo de residuo." }),
  customResidueType: z.string().optional(),
  category: z.enum(['BIOMASS', 'FOOD', 'AGRO', 'OTHERS'], { required_error: "Debes seleccionar una categoría." }),
  quantity: z.coerce.number().min(1, { message: "La cantidad debe ser mayor que 0." }),
  unit: z.enum(['KG', 'TON'], { required_error: "Debes seleccionar una unidad." }),
  frequency: z.enum(['ONCE', 'WEEKLY', 'MONTHLY'], { required_error: "Debes seleccionar una frecuencia." }),
  specifications: z.string().max(500, { message: "La descripción no puede exceder los 500 caracteres." }).optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CLOSED']),
  country: z.string().min(1, "El país es obligatorio."),
  city: z.string().min(1, "La ciudad es obligatoria."),
}).refine(data => {
    if (data.residueType === 'Otro' && (!data.customResidueType || data.customResidueType.trim().length < 2)) {
        return false;
    }
    return true;
}, {
    message: "Por favor, especifica el tipo de residuo.",
    path: ["customResidueType"],
});


type NeedFormValues = z.infer<typeof needFormSchema>

export default function NeedForm() {
  const router = useRouter();
  const { toast } = useToast()
  const searchParams = useSearchParams();
  const [needId, setNeedId] = useState<string | null>(null);
  const [uniqueResidueTypes, setUniqueResidueTypes] = useState<string[]>([]);
  const { companyId } = useRole();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        const allResidues = await getAllResidues();
        const types = [...new Set(allResidues.map(r => r.type))];
        setUniqueResidueTypes(types);

        const id = searchParams.get('id');
        if (id) {
          setNeedId(id);
          const need = await getNeedById(id);
          if (need) {
            const isStandardType = types.includes(need.residueType);
            form.reset({
              residueType: isStandardType ? need.residueType : 'Otro',
              customResidueType: isStandardType ? '' : need.residueType,
              category: need.category,
              quantity: need.quantity,
              unit: need.unit,
              frequency: need.frequency,
              status: need.status,
              specifications: need.specifications || "",
              country: need.company?.country || 'España',
              city: need.company?.city || '',
            });
          }
        }
        setIsLoading(false);
    }
    fetchData();
  }, [searchParams]);

  const form = useForm<NeedFormValues>({
    resolver: zodResolver(needFormSchema),
    defaultValues: {
      residueType: "",
      customResidueType: "",
      quantity: 1,
      unit: 'TON',
      category: undefined,
      frequency: 'MONTHLY',
      specifications: "",
      status: 'ACTIVE',
      country: "España",
      city: "",
    },
    mode: "onChange",
  })
  
  const selectedResidueType = form.watch("residueType");
  const selectedCountry = form.watch("country");
  const citiesForSelectedCountry = getCitiesByCountry(selectedCountry);
  
  useEffect(() => {
    if(!form.formState.isDirty) return;
    form.setValue('city', '');
  }, [selectedCountry, form]);

  async function onSubmit(data: NeedFormValues) {
    if (!companyId) {
      toast({ 
        title: "Error de autenticación", 
        description: "No se ha podido identificar tu empresa. Por favor, recarga la página o inicia sesión de nuevo.", 
        variant: "destructive" 
      });
      return;
    }

    const finalData = {
        companyId,
        residueType: data.residueType === 'Otro' ? data.customResidueType! : data.residueType,
        category: data.category,
        quantity: data.quantity,
        unit: data.unit,
        frequency: data.frequency,
        specifications: data.specifications,
        status: data.status,
    };

    if (needId) {
        await updateNeed({ ...finalData, id: needId });
         toast({
            title: "¡Necesidad Actualizada!",
            description: `Tu solicitud de "${finalData.residueType}" ha sido actualizada.`,
        })
    } else {
        await addNeed(finalData as any);
        toast({
            title: "¡Necesidad Publicada!",
            description: `Tu solicitud de "${finalData.residueType}" ha sido publicada con éxito.`,
        })
    }
    router.push('/dashboard/needs');
    router.refresh();
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin"/></div>
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
       <Card>
        <CardHeader>
          <CardTitle>{needId ? 'Editar Necesidad' : 'Publicar Nueva Necesidad'}</CardTitle>
          <CardDescription>
            {needId
                ? 'Actualiza los detalles de tu solicitud.'
                : 'Describe el residuo que tu empresa necesita para que los generadores puedan encontrarte.'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                        <FormField
                        control={form.control}
                        name="residueType"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Tipo de Residuo Buscado</FormLabel>
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
                                Selecciona un residuo o elige "Otro" para especificar.
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                        {selectedResidueType === 'Otro' && (
                            <FormField
                            control={form.control}
                            name="customResidueType"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Especificar otro tipo de residuo</FormLabel>
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
                        name="frequency"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Frecuencia de la Necesidad</FormLabel>
                             <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona una frecuencia" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="ONCE">Solo una vez</SelectItem>
                                    <SelectItem value="WEEKLY">Semanalmente</SelectItem>
                                    <SelectItem value="MONTHLY">Mensualmente</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                ¿Con qué frecuencia necesitas este residuo?
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
                                <FormLabel>País de Origen de la Necesidad</FormLabel>
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
                                    <SelectItem value="ACTIVE">Activa</SelectItem>
                                    <SelectItem value="PAUSED">En Pausa</SelectItem>
                                    <SelectItem value="CLOSED">Cerrada</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="md:col-span-2">
                    <FormField
                        control={form.control}
                        name="specifications"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Especificaciones Adicionales (Opcional)</FormLabel>
                            <FormControl>
                                <Textarea
                                placeholder="Añade detalles sobre la calidad, humedad, contaminantes aceptables, etc."
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
                    <Button type="button" variant="outline" onClick={() => router.push('/dashboard/needs')}>
                        Cancelar
                    </Button>
                    <Button type="submit">{needId ? 'Guardar Cambios' : 'Publicar Necesidad'}</Button>
                </div>
                </form>
            </Form>
        </CardContent>
       </Card>
    </div>
  )
}
