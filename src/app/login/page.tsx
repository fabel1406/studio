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
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
              <Link href="/" className="flex items-center justify-center gap-2 mb-4">
                <Logo className="h-10 w-auto" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
              </Link>
            <CardTitle className="text-2xl">¡Bienvenido de nuevo!</CardTitle>
            <CardDescription>
              Introduce tus credenciales para acceder a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm mode="login" />
            <div className="mt-4 text-center text-sm">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="underline text-primary">
                Regístrate
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}

