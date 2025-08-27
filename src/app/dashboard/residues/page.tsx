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
import { mockResidues } from '@/lib/data';

// This page is being phased out in favor of the Settings page for managing residue *types*
// and the Marketplace for managing *listings*.
// For now, it displays mock data.

export default function ResiduesPage() {
  const [residues, setResidues] = useState<Residue[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would fetch data for the current user.
    // Here we just use the global mock data.
    setResidues(mockResidues.filter(r => r.companyId === 'comp-1'));
  }, []);

  const deleteResidue = (residueId: string, residueType: string) => {
    // This is now a mock action. In a real app, it would call an API.
    setResidues(prevResidues => prevResidues.filter(r => r.id !== residueId));
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
