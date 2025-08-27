// src/app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DashboardHeader } from "@/components/dashboard-header";
import { ScrollToTop } from "@/components/scroll-to-top";

type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH";

type RoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUserId: string | null;
};

const RoleContext = createContext<RoleContextType | null>(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [role, setRole] = useState<UserRole>("GENERATOR"); // Default role
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would be derived from an auth session.
    // We mock it based on the selected role for demonstration.
    if (role === 'GENERATOR') {
        setCurrentUserId('comp-1');
    } else if (role === 'TRANSFORMER') {
        setCurrentUserId('comp-3');
    } else if (role === 'BOTH') {
        // For 'BOTH', the primary identity is the transformer one to allow
        // them to request residues from other generators in the marketplace.
        // But they also have access to generator features. The app logic for
        // posting residues/needs will still work based on the 'BOTH' role.
        setCurrentUserId('comp-3');
    }
  }, [role]);

  const value = useMemo(() => ({ role, setRole, currentUserId }), [role, currentUserId]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};


type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  roles: UserRole[];
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
    { href: "/logout", label: "Cerrar Sesión", icon: LogOut, roles: ["GENERATOR", "TRANSFORMER", "BOTH"] },
]

function DashboardContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRole();
  const { setOpenMobile } = useSidebar();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

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
                      {isMounted && filteredNavItems.map((item) => (
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
                  </SidebarMenu>
                  <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
                      <Avatar className="size-9">
                          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                          <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                          <span className="text-sm font-medium text-foreground">Usuario Admin</span>
                          <span className="text-xs text-muted-foreground">admin@ecoconnect.com</span>
                      </div>
                  </div>
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
