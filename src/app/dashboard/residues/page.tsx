// src/app/dashboard/residues/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import type { Residue } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAllResidues, deleteResidue as deleteResidueService } from '@/services/residue-service';

export default function ResiduesPage() {
  const [residues, setResidues] = useState<Residue[]>([]);

  useEffect(() => {
    // Fetch initial data on component mount
    const userResidues = getAllResidues().filter(r => r.companyId === 'comp-1');
    setResidues(userResidues);
  }, []);

  const { toast } = useToast();

  const deleteResidue = (residueId: string, residueType: string) => {
    deleteResidueService(residueId);
    // Refetch data to reflect the deletion
    const userResidues = getAllResidues().filter(r => r.companyId === 'comp-1');
    setResidues(userResidues);
    toast({
      title: "Residuo Eliminado",
      description: `La publicación para "${residueType}" ha sido eliminada.`,
    });
  };

  const dynamicColumns = columns({ deleteResidue });

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
      <DataTable data={residues} columns={dynamicColumns} />
    </div>
  );
}
