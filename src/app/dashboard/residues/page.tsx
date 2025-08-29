
// src/app/dashboard/residues/page.tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { columns as createColumns } from './components/columns';
import { DataTable } from './components/data-table';
import type { Residue } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllResidues, deleteResidue as deleteResidueService } from '@/services/residue-service';
import { useRole } from '../role-provider';

export default function ResiduesPage() {
  const [residues, setResidues] = useState<Residue[]>([]);
  const { toast } = useToast();
  const { role, currentUserId } = useRole();

  useEffect(() => {
    async function loadResidues() {
      if (currentUserId) {
          const allResidues = await getAllResidues();
          const userResidues = allResidues.filter(r => r.companyId === currentUserId);
          setResidues(userResidues);
      }
    }
    loadResidues();
  }, [currentUserId]);

  const deleteResidue = (residueId: string, residueType: string) => {
    deleteResidueService(residueId).then(async () => {
      if (currentUserId) {
        const allResidues = await getAllResidues();
        const userResidues = allResidues.filter(r => r.companyId === currentUserId);
        setResidues(userResidues);
      }
      toast({
        title: "Residuo Eliminado",
        description: `La publicación para "${residueType}" ha sido eliminada.`,
      });
    });
  };

  const columns = useMemo(() => createColumns({ deleteResidue }), [deleteResidue]);

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Publicaciones de Residuos</h2>
          <p className="text-muted-foreground">
            Aquí tienes una lista de todos los residuos que has publicado en el marketplace.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/dashboard/residues/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Publicación
                </Link>
            </Button>
        </div>
      </div>
      
      {residues.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <DataTable data={residues} columns={columns} />
        </div>
      ) : (
         <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm h-96">
          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              Aún no has publicado ningún residuo
            </h3>
            <p className="text-sm text-muted-foreground">
              ¡Empieza a convertir tus residuos en recursos!
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/residues/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Publicar Residuo
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

    