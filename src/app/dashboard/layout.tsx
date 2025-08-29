// src/app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { BarChart2, Leaf, Recycle, Settings, LogOut, LayoutDashboard, Search, List, PackagePlus, Handshake } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { Footer } from "@/components/footer";
import React, { useEffect } from 'react';
import { DashboardHeader } from "@/components/dashboard-header";
import { ScrollToTop } from "@/components/scroll-to-top";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRole, RoleProvider } from "./role-provider";
import { Skeleton } from "@/components/ui/skeleton";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: string[];
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: Search, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
  { href: "/dashboard/residues", label: "Mis Residuos", icon: List, roles: ["GENERATOR", "BOTH"] },
  { href: "/dashboard/needs", label: "Mis Necesidades", icon: PackagePlus, roles: ["TRANSFORMER", "BOTH"] },
  { href: "/dashboard/negotiations", label: "Negociaciones", icon: Handshake, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
  { href: "/dashboard/impact", label: "Impacto", icon: BarChart2, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
  { href: "/dashboard/matches", label: "Coincidencias", icon: Recycle, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
];

const settingsNav: NavItem[] = [
    { href: "/dashboard/settings", label: "Ajustes", icon: Settings, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
];

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, user, isLoading } = useRole();
  const { setOpenMobile } = useSidebar();
  const router = useRouter();

  useEffect(() => {
    // Handle redirection only when loading is complete and user is null.
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [isLoading, user, router]);

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('userRole');
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const UserInfo = () => (
     <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
        <Avatar className="size-9">
          {user?.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || user.email || 'User'} />}
          <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col group-data-[collapsible=icon]:hidden">
          <span className="text-sm font-medium text-foreground truncate">{user?.displayName || 'Usuario'}</span>
          <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
        </div>
      </div>
  );

  const UserInfoSkeleton = () => (
     <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
  );

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-16 w-16 animate-pulse" />
          <p className="text-muted-foreground">Cargando tu sesión...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarHeader>
           <Link href="/" className="flex items-center gap-2 p-2">
            <Logo className="size-12 shrink-0" />
            <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              EcoConnect
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {filteredNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} onClick={handleLinkClick}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {settingsNav.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} onClick={handleLinkClick}>
                  <SidebarMenuButton
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Cerrar Sesión">
                    <LogOut />
                    <span>Cerrar Sesión</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          {user ? <UserInfo /> : <UserInfoSkeleton />}
        </SidebarFooter>
      </Sidebar>
      <div className="flex-1 flex flex-col md:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-200">
        <DashboardHeader />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProvider>
      <SidebarProvider>
        <DashboardContent>{children}</DashboardContent>
      </SidebarProvider>
    </RoleProvider>
  )
}
