// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Logo } from "@/components/logo";

type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH";

type RoleContextType = {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUserId: string | null;
  isLoading: boolean;
};

const RoleContext = createContext<RoleContextType | null>(null);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
};

export const RoleProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("GENERATOR");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const storedRole = localStorage.getItem('userRole') as UserRole;
        const finalRole = storedRole || 'GENERATOR';
        setRole(finalRole);
      } else {
        setUser(null);
        router.push('/login');
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (user) {
      if (role === 'GENERATOR') {
          setCurrentUserId('comp-1');
      } else if (role === 'TRANSFORMER') {
          setCurrentUserId('comp-3');
      } else if (role === 'BOTH') {
          setCurrentUserId('comp-3');
      }
    } else {
        setCurrentUserId(null);
    }
  }, [role, user]);

  const value = useMemo(() => ({ user, role, setRole, currentUserId, isLoading }), [user, role, currentUserId, isLoading]);
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-16 w-16 animate-pulse" />
          <p className="text-muted-foreground">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // The redirect is handled in the effect, this prevents rendering children without a user.
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};
