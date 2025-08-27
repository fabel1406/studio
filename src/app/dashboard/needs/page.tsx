// src/app/dashboard/needs/page.tsx
"use client";

import { useState, useEffect } from 'react';
import type { Need } from '@/lib/types';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { getAllNeeds, deleteNeed as deleteNeedService } from '@/services/need-service';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRole } from '../layout';

export default function NeedsPage() {
  const [needs, setNeeds] = useState<Need[]>([]);
  const { toast } = useToast();
  const { role } = useRole();

  useEffect(() => {
    // In a real app, this would fetch data for the current user.
    // We filter by a mock company ID based on role.
    const currentUserCompanyId = role === 'GENERATOR' ? 'comp-1' : 'comp-3';
    setNeeds(getAllNeeds().filter(n => n.companyId === currentUserCompanyId));
  }, [role]);

  const deleteNeed = (needId: string, residueType: string) => {
    deleteNeedService(needId);
    const currentUserCompanyId = role === 'GENERATOR' ? 'comp-1' : 'comp-3';
    setNeeds(getAllNeeds().filter(n => n.companyId === currentUserCompanyId));
    toast({
      title: "Necesidad Eliminada",
      description: `Tu solicitud para "${residueType}" ha sido eliminada.`,
    });
  };

  const dynamicColumns = columns({ deleteNeed });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Necesidades</h2>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de residuos que tu empresa necesita.
          </p>
        </div>
         <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/dashboard/needs/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> Publicar Necesidad
                </Link>
            </Button>
        </div>
      </div>
      
      {needs.length > 0 ? (
        <DataTable data={needs} columns={dynamicColumns} />
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Aún no has publicado ninguna necesidad
            </h3>
            <p className="text-sm text-muted-foreground">
              Publica qué residuos buscas para que los generadores te encuentren.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/needs/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Publicar Necesidad
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
