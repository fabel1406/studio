// src/app/register/page.tsx
"use client";

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
import { useState } from "react";
import { MailCheck } from "lucide-react";

export default function RegisterPage() {
  const [isVerificationEmailSent, setIsVerificationEmailSent] = useState(false);

  return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <Link href="/" className="flex items-center justify-center gap-2 mb-4">
              <Logo className="h-10 w-auto" />
               <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
            </Link>
            <CardTitle className="text-2xl">
              {isVerificationEmailSent ? "¡Revisa tu correo!" : "Crear una cuenta"}
            </CardTitle>
            <CardDescription>
              {isVerificationEmailSent 
                ? "Te hemos enviado un enlace de verificación. Haz clic en él para activar tu cuenta."
                : "Únete a EcoConnect y empieza a convertir residuos en valor."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
             {isVerificationEmailSent ? (
              <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-muted">
                <MailCheck className="h-16 w-16 text-primary mb-4" />
                <p className="text-muted-foreground">
                  Una vez verificado, podrás{" "}
                  <Link href="/login" className="font-bold text-primary hover:underline">
                    iniciar sesión
                  </Link>.
                </p>
              </div>
            ) : (
              <>
                <AuthForm mode="register" onVerificationSent={() => setIsVerificationEmailSent(true)} />
                <div className="mt-4 text-center text-sm">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="underline text-primary">
                    Iniciar sesión
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
  );
}
