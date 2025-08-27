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

type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH"

type ResidueActionPanelProps = {
  residue: Residue
}

export function ResidueActionPanel({ residue }: ResidueActionPanelProps) {
  // In a real app, this would come from the user's session or context
  const currentUserRole: UserRole = "TRANSFORMER"
  const currentUserCompanyId = 'comp-3' // Mocking transformer company

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
    addNegotiation({
      residueId: residue.id,
      supplierId: residue.companyId,
      requesterId: currentUserCompanyId,
      quantity: values.quantity,
      unit: residue.unit
    })
    toast({
      title: "Solicitud Enviada",
      description: `Has solicitado ${values.quantity} ${residue.unit} de ${residue.type}. El generador ha sido notificado.`,
    })
    router.push('/dashboard/negotiations');
  }

  // A Transformer is viewing a Generator's listing
  if (currentUserRole === "TRANSFORMER" || currentUserRole === "BOTH") {
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
                <Send className="mr-2" />
                Contactar y Solicitar
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    )
  }

  // Future cases:
  // - A Generator viewing a Transformer's "Need"
  // - A Generator/Transformer viewing their own listing

  return null // Return null if no action is applicable
}
