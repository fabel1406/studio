
// src/app/dashboard/role-provider.tsx
"use client";

import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const supabase = createClient();

  const fetchCompanyData = useCallback(async (currentUser: User) => {
    let { data: companyData, error: fetchError } = await supabase
      .from('companies')
      .select('id, name, type')
      .eq('auth_id', currentUser.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error("Error fetching company data:", fetchError);
        return false;
    }

    // If company doesn't exist, create it from metadata
    if (!companyData) {
        const { company_name, app_role } = currentUser.user_metadata;
        if (company_name && app_role) {
            const { data: newCompany, error: createError } = await supabase
                .from('companies')
                .insert({
                    auth_id: currentUser.id,
                    name: company_name,
                    type: app_role,
                    contact_email: currentUser.email
                })
                .select('id, name, type')
                .single();
            
            if (createError) {
                console.error("Error creating company from metadata:", createError);
                return false;
            }
            companyData = newCompany;
        } else {
             // If no metadata, user needs to complete profile
            if (pathname !== '/dashboard/settings') {
                router.push('/dashboard/settings?new=true');
            }
            return false;
        }
    }
    
    setCompanyId(companyData.id);
    setCompanyName(companyData.name);
    setInternalRole(companyData.type as UserRole);
    return true;

  }, [supabase, router, pathname]);

  useEffect(() => {
    const checkUserAndFetchData = async () => {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user;

      if (currentUser) {
        setUser(currentUser);
        await fetchCompanyData(currentUser);
      } else {
        if (pathname.startsWith('/dashboard')) {
          router.push('/login');
        }
      }
      setIsLoading(false);
    };

    checkUserAndFetchData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        setIsLoading(true);
        if (currentUser) {
            await fetchCompanyData(currentUser);
        } else {
            setCompanyId(null);
            setCompanyName("");
            setInternalRole("GENERATOR");
            if (pathname.startsWith('/dashboard')) {
              router.push('/login');
            }
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setRole = (newRole: UserRole) => {
    setInternalRole(newRole);
  }
  
  const logout = async () => {
      await supabase.auth.signOut();
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
  
  if (!user && pathname.startsWith('/dashboard')) {
      return null;
  }

  return (
    <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
  );
};
