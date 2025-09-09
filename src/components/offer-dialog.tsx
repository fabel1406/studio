
// src/components/offer-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { useToast } from "@/hooks/use-toast";
import type { Need, Residue, Negotiation } from "@/lib/types";
import { addNegotiation, updateNegotiationDetails } from "@/services/negotiation-service";
import { useRouter } from "next/navigation";
import { useMemo, useEffect } from "react";
import { useRole } from "@/app/dashboard/role-provider";

type OfferDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  need?: Need; // For creating a new offer
  negotiationToEdit?: Negotiation; // For editing an existing offer
  onOfferUpdated?: (negotiation: Negotiation) => void;
  userResidues?: Residue[];
};

export function OfferDialog({ 
  isOpen, 
  onOpenChange, 
  need, 
  userResidues, 
  negotiationToEdit,
  onOfferUpdated,
}: OfferDialogProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { companyId } = useRole();
  
  const isEditMode = !!negotiationToEdit;

  const compatibleResidues = useMemo(() => {
    if (isEditMode && negotiationToEdit?.residue) {
      return [negotiationToEdit.residue];
    }
    if (need && userResidues) {
      return userResidues.filter(r => r.type.toLowerCase() === need.residueType.toLowerCase());
    }
    return [];
  }, [userResidues, need, negotiationToEdit, isEditMode]);


  const FormSchema = z.object({
    residueId: z.string({ required_error: "Debes seleccionar un residuo para ofertar." }),
    quantity: z.coerce.number().min(0.1, "La cantidad debe ser mayor que 0."),
    price: z.preprocess(
      (val) => (val === "" || val === null || val === undefined) ? undefined : Number(val),
      z.coerce.number({ invalid_type_error: "El precio debe ser un número." }).optional()
    ),
  }).refine(data => {
    const selectedResidue = compatibleResidues.find(r => r.id === data.residueId);
    if (isEditMode) return true; // Don't check stock when editing, for simplicity. Could be enhanced later.
    return !selectedResidue || data.quantity <= selectedResidue.quantity;
  }, {
    message: "No puedes ofertar más cantidad de la que tienes disponible en el residuo seleccionado.",
    path: ["quantity"],
  });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      residueId: undefined,
      quantity: undefined,
      price: undefined,
    }
  });

  useEffect(() => {
    if (isEditMode && negotiationToEdit) {
      form.reset({
        residueId: negotiationToEdit.residueId,
        quantity: negotiationToEdit.quantity,
        price: negotiationToEdit.offerPrice,
      });
    } else if (isOpen) { // Reset form when opening for creation
      form.reset({
        residueId: undefined,
        quantity: undefined,
        price: undefined,
      });
    }
  }, [isEditMode, negotiationToEdit, isOpen, form]);
  
  const selectedResidueId = form.watch("residueId");
  const selectedResidue = compatibleResidues.find(r => r.id === selectedResidueId);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!companyId) {
        toast({ title: "Error", description: "No se pudo identificar al usuario.", variant: "destructive" });
        return;
    }
      
    if (isEditMode && negotiationToEdit) {
        const updatedNegotiation = await updateNegotiationDetails(negotiationToEdit.id, data.quantity, data.price);
        toast({
            title: "¡Oferta Modificada!",
            description: `Tu oferta ha sido actualizada a ${data.quantity} ${updatedNegotiation.unit}.`,
        });
        if (onOfferUpdated) {
            onOfferUpdated(updatedNegotiation);
        }
    } else if (need && selectedResidue) {
        const result = await addNegotiation({
          type: 'offer',
          residue: selectedResidue,
          need: need,
          initiatorId: companyId,
          quantity: data.quantity,
          offerPrice: data.price,
        });

        if (result) {
            toast({
              title: "¡Oferta Enviada!",
              description: `Tu oferta para ${need.residueType} ha sido enviada.`,
            });
            router.push('/dashboard/negotiations');
            router.refresh();
        } else {
             toast({
              title: "Error al enviar la oferta",
              description: "Ya tienes una negociación activa para este residuo con esta empresa.",
              variant: "destructive",
            });
        }
    }
    
    onOpenChange(false);
  };

  const title = isEditMode ? "Modificar Oferta" : "Hacer una Oferta";
  const description = isEditMode && negotiationToEdit
    ? `Ajusta los detalles de tu oferta para ${negotiationToEdit.residue.type}.`
    : `Oferta uno de tus residuos publicados para la necesidad de "${need?.residueType}".`;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {compatibleResidues.length > 0 ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="residueId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Residuo a Ofertar</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value} disabled={isEditMode}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona uno de tus residuos" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {compatibleResidues.map(residue => (
                          <SelectItem key={residue.id} value={residue.id}>
                            {residue.type} ({residue.quantity} {residue.unit} disponibles)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedResidue && (
                <>
                   <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad a Ofertar ({selectedResidue.unit})</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder={isEditMode ? '' : `Máx: ${selectedResidue.quantity}`} {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio por {selectedResidue.unit} (Opcional)</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="Ej: 15.00" {...field} value={field.value ?? ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={!selectedResidue || form.formState.isSubmitting}>
                    {isEditMode ? "Guardar Cambios" : "Enviar Oferta"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
           <div className="py-8 text-center">
                <p className="text-muted-foreground">{isEditMode ? "No se pudo cargar el residuo para editar." : "No tienes residuos compatibles publicados."}</p>
                {!isEditMode && (
                    <Button variant="link" asChild className="mt-2">
                        <Link href="/dashboard/residues/create">Publica un residuo primero</Link>
                    </Button>
                )}
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
