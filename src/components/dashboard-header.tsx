// src/components/dashboard-header.tsx
"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
      <SidebarTrigger />
      <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
        EcoConnect
      </h1>
    </header>
  )
}
