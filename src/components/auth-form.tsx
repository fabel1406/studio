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
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
};

export function AuthForm({ mode }: AuthFormProps) {
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
    try {
        if (mode === 'register') {
            const { email, password, role } = values as z.infer<typeof registerSchema>;
            await createUserWithEmailAndPassword(auth, email, password);
            // In a real app, you would save the role to Firestore or Realtime Database here.
            localStorage.setItem('userRole', role); // Using localStorage for mock purposes
             toast({
                title: "¡Registro Exitoso!",
                description: "¡Bienvenido a EcoConnect! Te estamos redirigiendo al panel. No olvides completar tu perfil en Ajustes para empezar a negociar.",
            });
            router.push("/dashboard");
        } else {
            const { email, password } = values as z.infer<typeof loginSchema>;
            await signInWithEmailAndPassword(auth, email, password);
            // In a real app, you'd fetch the role from your database after login.
            // For this mock, we'll assign a role based on the email.
            if (email.toLowerCase() === 'admin@ecoconnect.com') {
              localStorage.setItem('userRole', 'BOTH');
            } else if (email.includes('generator')) {
               localStorage.setItem('userRole', 'GENERATOR');
            } else {
               localStorage.setItem('userRole', 'TRANSFORMER');
            }
             toast({
                title: "Inicio de Sesión Exitoso",
                description: "Redirigiendo al marketplace...",
            });
            router.push("/dashboard/marketplace");
        }
       
    } catch (error: any) {
        console.error("Authentication error:", error);
        let description = "Ha ocurrido un error inesperado.";
        switch (error.code) {
            case 'auth/email-already-in-use':
                description = "Este correo electrónico ya está en uso. Por favor, inicia sesión.";
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
                description = "Correo electrónico o contraseña incorrectos.";
                break;
            case 'auth/weak-password':
                description = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
                break;
        }
        toast({
            title: "Error de autenticación",
            description: description,
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
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
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
