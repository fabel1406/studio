// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { Logo } from "@/components/logo";
import { createClient } from "@/lib/supabase/client";

type UserRole = "GENERATOR" | "TRANSFORMER" | "BOTH";

type RoleContextType = {
  user: User | null;
  companyName: string;
  role: UserRole;
  setRole: (role: UserRole) => void;
  companyId: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
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
  const [companyName, setCompanyName] = useState<string>("");
  const [role, setInternalRole] = useState<UserRole>("GENERATOR");
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const fetchCompanyData = useCallback(async (currentUser: User) => {
    const { data: companyData, error } = await supabase
      .from('companies')
      .select('id, name, type')
      .eq('auth_id', currentUser.id)
      .single();
    
    if (companyData) {
      setCompanyId(companyData.id);
      setCompanyName(companyData.name);
      setInternalRole(companyData.type as UserRole);
    } else {
        console.warn("No company found for user:", currentUser.id, "Error:", error?.message);
        // Handle case where company might not be created yet, maybe redirect to settings
    }
  }, [supabase]);


  useEffect(() => {
    const fetchSessionAndCompany = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        await fetchCompanyData(currentUser);
      }
      setIsLoading(false);
    };

    fetchSessionAndCompany();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (event === 'SIGNED_IN' && currentUser) {
            await fetchCompanyData(currentUser);
        } else if (event === 'SIGNED_OUT') {
            setCompanyId(null);
            setCompanyName("");
            setInternalRole("GENERATOR");
            router.push('/login');
        } else if (event === 'USER_UPDATED' && currentUser) {
            await fetchCompanyData(currentUser);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchCompanyData, router]);

  
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);


  const setRole = async (newRole: UserRole) => {
    // This function might be more complex if role changes need DB updates
    setInternalRole(newRole);
  }
  
  const logout = async () => {
      await supabase.auth.signOut();
  }

  const value = useMemo(() => ({ user, role, setRole, companyId, isLoading, logout, companyName }), [user, role, companyId, isLoading, logout, companyName]);
  
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

  if (!user && !isLoading) {
      // This should be handled by the useEffect redirect, but as a fallback
      return null;
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};