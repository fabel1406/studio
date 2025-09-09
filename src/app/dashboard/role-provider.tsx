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

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data: companyData } = await supabase
          .from('companies')
          .select('id, name, type')
          .eq('auth_id', currentUser.id)
          .single();
        
        if (companyData) {
          setCompanyId(companyData.id);
          setCompanyName(companyData.name);
          setInternalRole(companyData.type as UserRole);
        }
      }
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (event === 'SIGNED_IN' && currentUser) {
            // Fetch company data only when user signs in, not on every event
            supabase.from('companies').select('id, name, type').eq('auth_id', currentUser.id).single().then(({data}) => {
                if (data) {
                    setCompanyId(data.id);
                    setCompanyName(data.name);
                    setInternalRole(data.type as UserRole);
                }
            })
        } else if (event === 'SIGNED_OUT') {
            setCompanyId(null);
            setCompanyName("");
            setInternalRole("GENERATOR");
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);


  const setRole = async (newRole: UserRole) => {
    setInternalRole(newRole);
  }
  
  const logout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
  }

  const value = useMemo(() => ({ user, role, setRole, companyId, isLoading, logout, companyName }), [user, role, companyId, isLoading, companyName]);
  
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
      return null;
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};
