// src/components/offer-dialog.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import type { Need, Residue } from "@/lib/types";
import { addNegotiation } from "@/services/negotiation-service";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type OfferDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  need: Need;
  userResidues: Residue[];
};

export function OfferDialog({ isOpen, onOpenChange, need, userResidues }: OfferDialogProps) {
  const router = useRouter();
  const { toast } = useToast();

  // Filter residues that are compatible with the need's type
  const compatibleResidues = useMemo(
      () => userResidues.filter(r => r.type.toLowerCase() === need.residueType.toLowerCase()),
      [userResidues, need.residueType]
  );

  const FormSchema = z.object({
    residueId: z.string({ required_error: "Debes seleccionar un residuo para ofertar." }),
    quantity: z.coerce.number().min(0.1, "La cantidad debe ser mayor que 0."),
    price: z.coerce.number().optional(),
  }).refine(data => {
    const selectedResidue = compatibleResidues.find(r => r.id === data.residueId);
    return !selectedResidue || data.quantity <= selectedResidue.quantity;
  }, {
    message: "No puedes ofertar más cantidad de la que tienes disponible en el residuo seleccionado.",
    path: ["quantity"],
  });


  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  
  const selectedResidueId = form.watch("residueId");
  const selectedResidue = compatibleResidues.find(r => r.id === selectedResidueId);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    if (!selectedResidue) return;

    addNegotiation({
      needId: need.id,
      residue: selectedResidue,
      supplierId: selectedResidue.companyId, // Generator
      requesterId: need.companyId, // Transformer
      quantity: data.quantity,
      unit: selectedResidue.unit,
      offerPrice: data.price,
    });
    
    toast({
      title: "¡Oferta Enviada!",
      description: `Tu oferta para ${need.residueType} ha sido enviada a ${need.companyId}.`,
    });
    onOpenChange(false);
    router.push('/dashboard/negotiations');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hacer una Oferta</DialogTitle>
          <DialogDescription>
            Oferta uno de tus residuos publicados para la necesidad de <span className="font-bold text-primary">{need.residueType}</span>.
          </DialogDescription>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                          <Input type="number" placeholder={`Máx: ${selectedResidue.quantity}`} {...field} />
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
                          <Input type="number" step="0.01" placeholder="Ej: 15.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                <Button type="submit" disabled={!selectedResidue || form.formState.isSubmitting}>Enviar Oferta</Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
           <div className="py-8 text-center">
                <p className="text-muted-foreground">No tienes residuos compatibles publicados.</p>
                <Button variant="link" asChild className="mt-2">
                    <Link href="/dashboard/residues/create">Publica un residuo primero</Link>
                </Button>
            </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
