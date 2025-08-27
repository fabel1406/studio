import Link from "next/link";
import { Logo } from "./logo";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import { Button } from "./ui/button";

export function Footer() {
  return (
    <footer className="bg-card dark:bg-card/50 border-t shadow-lg transition-shadow">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo className="h-10 w-auto" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Transformando residuos en recursos para un futuro sostenible.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 md:col-span-3 gap-8">
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-wider uppercase">Soluciones</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/dashboard/marketplace" className="text-sm text-muted-foreground hover:text-primary">Marketplace</Link></li>
                <li><Link href="/dashboard/impact" className="text-sm text-muted-foreground hover:text-primary">Seguimiento de Impacto</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Para Generadores</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Para Transformadores</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-wider uppercase">Compañía</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">Sobre Nosotros</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Empleo</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Prensa</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-4">
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Política de Privacidad</Link></li>
                <li><Link href="#" className="text-sm text-muted-foreground hover:text-primary">Términos de Servicio</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-sm text-muted-foreground md:order-1">
            &copy; {new Date().getFullYear()} EcoConnect. Todos los derechos reservados.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 md:order-2">
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
                <Link href="https://www.instagram.com/ecoconnectlab" target="_blank" aria-label="Instagram"><Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
