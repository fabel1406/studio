// src/app/dashboard/residues/page.tsx
import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { columns } from './components/columns';
import { DataTable } from './components/data-table';
import { mockResidues } from '@/lib/data';
import { residueSchema } from './data/schema';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

// Simulate fetching and validating data
async function getResidues() {
  // We're using mock data, but in a real app this would be an API call
  const data = mockResidues.map(r => ({ ...r, company: undefined }));

  // We can use Zod to validate the data structure
  return z.array(residueSchema).parse(data);
}

export default async function ResiduesPage() {
  const residues = await getResidues();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Residuos</h2>
          <p className="text-muted-foreground">
            Aquí tienes una lista de todos los residuos que has publicado.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button asChild>
                <Link href="/dashboard/residues/create">
                    <PlusCircle className="mr-2 h-4 w-4" /> Añadir Residuo
                </Link>
            </Button>
        </div>
      </div>
      <DataTable data={residues} columns={columns} />
    </div>
  );
}
