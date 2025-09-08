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
import { createClient } from "@/lib/supabase";

const loginSchema = z.object({
  email: z.string().email({ message: "Dirección de correo electrónico no válida." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const registerSchema = z.object({
  email: z.string().email({ message: "Dirección de correo electrónico no válida." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  role: z.enum(["GENERATOR", "TRANSFORMER", "BOTH"], {
    required_error: "Debes seleccionar un rol.",
  }),
});

// Create a combined schema that makes `role` optional for use in the form hook
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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      ...(mode === "register" && { role: undefined }),
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    const supabase = createClient();
    try {
        if (mode === 'register') {
            const { email, password, role } = values as z.infer<typeof registerSchema>;
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: role
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                }
            });

            if (error) throw error;
            
            localStorage.setItem('userRole', role);
            if (onVerificationSent) {
              onVerificationSent();
            } else {
              toast({
                  title: "¡Registro Exitoso!",
                  description: "Revisa tu correo para verificar tu cuenta.",
              });
            }
            form.reset();
        } else {
            const { email, password } = values as z.infer<typeof loginSchema>;
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            
            if (error) throw error;

            const userRole = data.user?.user_metadata.role || 'GENERATOR';
            localStorage.setItem('userRole', userRole);

             toast({
                title: "Inicio de Sesión Exitoso",
                description: "Redirigiendo al panel de control...",
            });
            router.push("/dashboard");
        }
       
    } catch (error: any) {
        console.error("Authentication error:", error);
        toast({
            title: "Error de autenticación",
            description: error.message || "Ha ocurrido un error inesperado.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <Select onValueChange={field.onChange} defaultValue={field.value as string} disabled={isLoading}>
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
