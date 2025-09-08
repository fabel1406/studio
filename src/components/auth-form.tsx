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
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useRole } from "@/app/dashboard/role-provider";


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
  const { setRole } = useRole();
  const schema = mode === "login" ? loginSchema : registerSchema;

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
    try {
      if (mode === 'register') {
        const { email, password, role, companyName } = values as z.infer<typeof registerSchema>;
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with company name and role
        // Note: Firebase Auth doesn't have a native 'role' field. 
        // We store it in localStorage and could also use Firestore or a custom claims system.
        await updateProfile(user, { displayName: companyName });

        // For this app, we'll manage role on the client side.
        setRole(role);
        
        // This is a placeholder for sending a verification email
        // In a real Supabase/Firebase project, this would be configured in the backend
        // await sendEmailVerification(user);

        if (onVerificationSent) {
          onVerificationSent();
        } else {
            toast({
                title: "¡Registro Exitoso!",
                description: "Revisa tu correo para verificar tu cuenta.",
            });
        }
        
      } else { // Login mode
        const { email, password } = values as z.infer<typeof loginSchema>;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Fetch user role from localStorage, as Firebase Auth doesn't store it by default
        const storedRole = localStorage.getItem('userRole') as "GENERATOR" | "TRANSFORMER" | "BOTH" | null;
        if(storedRole) setRole(storedRole);
        
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      const errorCode = error.code || 'auth/unknown-error';
      let friendlyMessage = "Ha ocurrido un error inesperado.";
      
      switch(errorCode) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          friendlyMessage = "Correo electrónico o contraseña incorrectos.";
          break;
        case 'auth/email-already-in-use':
          friendlyMessage = "Este correo electrónico ya está registrado.";
          break;
        case 'auth/weak-password':
          friendlyMessage = "La contraseña es demasiado débil. Debe tener al menos 6 caracteres.";
          break;
        case 'auth/invalid-email':
           friendlyMessage = "El formato del correo electrónico no es válido.";
           break;
        default:
          console.log(errorCode); // Log other errors for debugging
          break;
      }
      
      toast({
        title: "Error de autenticación",
        description: friendlyMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
