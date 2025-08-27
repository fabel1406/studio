import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Logo } from "@/components/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PublicLayout from "../(public)/layout";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <Logo className="h-10 w-auto" />
               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
            </Link>
            <CardTitle className="text-2xl">Crear una cuenta</CardTitle>
            <CardDescription>
              Únete a EcoConnect y empieza a convertir residuos en valor.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="register" />
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="underline text-primary">
                Iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
