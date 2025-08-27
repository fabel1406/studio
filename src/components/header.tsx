"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sun, Moon } from "lucide-react";
import { Logo } from "./logo";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

const navLinks = [
  { href: "/dashboard/marketplace", label: "Marketplace" },
  { href: "/for-generators", label: "Para Generadores" },
  { href: "/for-transformers", label: "Para Transformadores" },
  { href: "/about", label: "Sobre Nosotros" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    setMounted(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-lg border-b" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-10 w-auto" />
            <span className="text-xl font-bold text-foreground hidden sm:inline bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-base font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
             {mounted && (
                <Button variant="ghost" size="icon" onClick={toggleDarkMode} aria-label="Toggle theme">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
            )}
            <div className="hidden lg:flex items-center gap-2">
              <Button asChild variant="ghost">
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Registrarse</Link>
              </Button>
            </div>
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between border-b pb-4">
                      <Link href="/" className="flex items-center gap-2">
                        <Logo className="h-10 w-auto" />
                        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">EcoConnect</span>
                      </Link>
                    </div>
                    <nav className="flex flex-col gap-6 mt-8">
                      {navLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="text-xl font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </nav>
                    <div className="mt-auto border-t pt-6 flex flex-col gap-4">
                      <Button asChild variant="outline">
                        <Link href="/login">Iniciar Sesión</Link>
                      </Button>
                      <Button asChild>
                        <Link href="/register">Registrarse</Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
