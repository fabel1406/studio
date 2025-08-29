// src/components/residue-action-panel.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { Residue } from "@/lib/types"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Send } from "lucide-react"
import { addNegotiation } from "@/services/negotiation-service"
import { useRouter } from "next/navigation"
import { useRole } from "@/app/dashboard/role-provider"

type ResidueActionPanelProps = {
  residue: Residue
}

export function ResidueActionPanel({ residue }: ResidueActionPanelProps) {
  const { role, currentUserId } = useRole();
  
  const { toast } = useToast()
  const router = useRouter();

  const actionSchema = z.object({
    quantity: z.coerce.number()
      .min(0.1, `Debes solicitar al menos 0.1 ${residue.unit}.`)
      .max(residue.quantity, `No puedes solicitar más de la cantidad disponible (${residue.quantity} ${residue.unit}).`),
  })

  const form = useForm<z.infer<typeof actionSchema>>({
    resolver: zodResolver(actionSchema),
    defaultValues: {
      quantity: residue.quantity,
    },
  })

  const onSubmit = (values: z.infer<typeof actionSchema>) => {
    if (!currentUserId) {
      toast({ title: "Error", description: "Usuario no identificado.", variant: "destructive" });
      return;
    }
    
    const result = addNegotiation({
      type: 'request',
      residue: residue,
      initiatorId: currentUserId,
      quantity: values.quantity,
      // Pass the residue's price as the initial offer price
      offerPrice: residue.pricePerUnit, 
    })

    if (result) {
        toast({
          title: "Solicitud Enviada",
          description: `Has solicitado ${values.quantity} ${residue.unit} de ${residue.type}. El generador ha sido notificado.`,
        })
        router.push('/dashboard/negotiations');
        router.refresh();
    } else {
        toast({
            title: "Error al enviar la solicitud",
            description: "Ya tienes una negociación activa para este residuo con esta empresa.",
            variant: "destructive",
        })
    }
  }

  // A Transformer or a user with BOTH roles can request a residue from another company.
  // They cannot request their own residue.
  if ((role === "TRANSFORMER" || role === "BOTH") && residue.companyId !== currentUserId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitar Residuo</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad ({residue.unit})</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Contactar y Solicitar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  return null
}
