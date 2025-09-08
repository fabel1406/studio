// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { type User, onAuthStateChanged, signOut } from "firebase/auth";
import { Logo } from "@/components/logo";
import { auth } from "@/lib/firebase";

type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH";

type RoleContextType = {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUserId: string | null;
  isLoading: boolean;
  logout: () => void;
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
  const [role, setInternalRole] = useState<UserRole>("GENERATOR");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        const savedRole = localStorage.getItem('userRole') as UserRole;
        if (savedRole) {
          setInternalRole(savedRole);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);


  const setRole = (newRole: UserRole) => {
    setInternalRole(newRole);
    localStorage.setItem('userRole', newRole);
  }
  
  const logout = async () => {
      await signOut(auth);
      localStorage.removeItem('userRole');
      router.push('/login');
  }

  useEffect(() => {
    if (user) {
       if (role === 'GENERATOR') {
          setCurrentUserId('comp-1');
      } else if (role === 'TRANSFORMER') {
          setCurrentUserId('comp-3');
      } else if (role === 'BOTH') {
          setCurrentUserId('comp-1'); // Default to generator for now
      }
    } else {
        setCurrentUserId(null);
    }
  }, [role, user]);

  const value = useMemo(() => ({ user, role, setRole, currentUserId, isLoading, logout }), [user, role, currentUserId, isLoading]);
  
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
      return null;
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};
