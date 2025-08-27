

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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/logo";
import { BarChart2, Leaf, Recycle, Settings, LogOut, LayoutDashboard, Search } from "lucide-react";
import type { LucideIcon } from 'lucide-react';
import { Footer } from "@/components/footer";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/dashboard", label: "Resumen", icon: LayoutDashboard },
  { href: "/dashboard/marketplace", label: "Marketplace", icon: Search },
  { href: "/dashboard/impact", label: "Impacto", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Mis Residuos", icon: Leaf },
  { href: "/dashboard/matches", label: "Coincidencias", icon: Recycle },
];

const settingsNav: NavItem[] = [
    { href: "/dashboard/settings", label: "Ajustes", icon: Settings },
    { href: "/logout", label: "Cerrar Sesión", icon: LogOut },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          <Sidebar>
              <SidebarHeader>
                   <div className="flex items-center gap-2 p-2">
                      <Logo className="size-12 shrink-0" />
                      <span className="text-xl font-semibold group-data-[collapsible=icon]:hidden bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                          EcoConnect
                      </span>
                  </div>
              </SidebarHeader>
              <SidebarContent>
                  <SidebarMenu>
                      {navItems.map((item) => (
                          <SidebarMenuItem key={item.href}>
                              <Link href={item.href}>
                                  <SidebarMenuButton 
                                      isActive={pathname.startsWith(item.href) && (item.href !== '/dashboard' || pathname === '/dashboard')}
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
                             <Link href={item.href}>
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
          <main className="flex-1 md:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-200">{children}</main>
        </div>
        <div className="md:ml-[var(--sidebar-width-icon)] lg:ml-[var(--sidebar-width)] transition-[margin-left] duration-200">
            <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
