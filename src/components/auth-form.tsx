// src/components/auth-form.tsx
"use client";

import { useForm } from "react-hook-form";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";


const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo electrónico no válida." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const registerSchema = z.object({
  companyName: z.string().min(2, { message: "El nombre de la empresa debe tener al menos 2 caracteres." }),
  email: z.string().email({ message: "Dirección de correo electrónico no válida." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  role: z.enum(["GENERATOR", "TRANSFORMER", "BOTH"], {
    required_error: "Debes seleccionar un rol.",
  }),
});

const formSchema = z.union([loginSchema, registerSchema]);
type FormValues = z.infer<typeof formSchema>;


type AuthFormProps = {
  mode: "login" | "register";
  onVerificationSent?: () => void;
};

export function AuthForm({ mode, onVerificationSent }: AuthFormProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const schema = mode === "login" ? loginSchema : registerSchema;
  const supabase = createClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" && { companyName: "", role: undefined }),
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    if (mode === 'register') {
      const { email, password, role, companyName } = values as z.infer<typeof registerSchema>;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
          data: {
            company_name: companyName,
            app_role: role,
          }
        },
      })

      if (error) {
        toast({
          title: "Error en el registro",
          description: error.message || "No se pudo crear la cuenta.",
          variant: "destructive",
        });
      } else {
        if (onVerificationSent) {
          onVerificationSent();
        } else {
            toast({
                title: "¡Registro Exitoso!",
                description: "Revisa tu correo para verificar tu cuenta.",
            });
        }
      }

    } else { // Login mode
      const { email, password } = values as z.infer<typeof loginSchema>;
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error de autenticación",
          description: error.message || "Correo electrónico o contraseña incorrectos.",
          variant: "destructive",
        });
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
    
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "register" && (
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Empresa</FormLabel>
                <FormControl>
                  <Input placeholder="Tu Empresa S.L." {...field} disabled={isLoading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="nombre@ejemplo.com" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {mode === "register" && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Soy un...</FormLabel>
                <Select onValueChange={(value) => field.onChange(value as "GENERATOR" | "TRANSFORMER" | "BOTH")} defaultValue={field.value as string} disabled={isLoading}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="GENERATOR">Generador de Residuos</SelectItem>
                    <SelectItem value="TRANSFORMER">Transformador de Residuos</SelectItem>
                    <SelectItem value="BOTH">Ambos (Generador y Transformador)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Iniciar Sesión" : "Crear Cuenta"}
        </Button>
      </form>
    </Form>
  );
}
