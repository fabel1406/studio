
// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);

        if (currentUser) {
          const { data, error } = await supabase.from('companies').select('id, name, type').eq('auth_id', currentUser.id).single();
          
          if (data) {
            setCompanyId(data.id);
            setCompanyName(data.name);
            setInternalRole(data.type as UserRole);
            localStorage.setItem('userRole', data.type);
          } else {
              // Fallback for metadata if DB call fails or is new user
              const userRole = currentUser.user_metadata?.app_role as UserRole;
              const userCompanyName = currentUser.user_metadata?.company_name || currentUser.email?.split('@')[0] || "Usuario";
              if(userRole) setInternalRole(userRole);
              setCompanyName(userCompanyName);
              localStorage.setItem('userRole', userRole || "GENERATOR");
          }
        } else {
            // Clear on logout
            localStorage.removeItem('userRole');
            setCompanyId(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, router]);

  
  useEffect(() => {
    if (!isLoading && !user) {
        router.push('/login');
    }
  }, [user, isLoading, router]);


  const setRole = async (newRole: UserRole) => {
    if (!companyId) return;
    setInternalRole(newRole);
    localStorage.setItem('userRole', newRole);
    await supabase.from('companies').update({ type: newRole }).eq('id', companyId);
    await supabase.auth.updateUser({ data: { app_role: newRole } });
  }
  
  const logout = async () => {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
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

  if (!user) {
      return null;
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};

    