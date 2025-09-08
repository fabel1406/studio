// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Logo } from "@/components/logo";
import { createClient } from '@/lib/supabase';

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
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Check initial session
    const checkInitialSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        setIsLoading(false);
    };

    checkInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);
  
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
    
    if (user) {
        const storedRole = localStorage.getItem('userRole') as UserRole;
        const finalRole = storedRole || (user.user_metadata.role as UserRole) || 'GENERATOR';
        setRole(finalRole);
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      if (role === 'GENERATOR') {
          setCurrentUserId('comp-1');
      } else if (role === 'TRANSFORMER') {
          setCurrentUserId('comp-3');
      } else if (role === 'BOTH') {
          // For the demo, if role is 'BOTH', we can assign one of the IDs.
          // In a real app, this logic might be more complex, perhaps allowing user to switch company contexts.
          setCurrentUserId('comp-1'); 
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

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};
