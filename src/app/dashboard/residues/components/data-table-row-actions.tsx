// src/app/dashboard/residues/components/data-table-row-actions.tsx
"use client"

import { MoreHorizontal, Trash, Edit } from "lucide-react"
import { Row } from "@tanstack/react-table"
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Residue } from "@/lib/types";


interface DataTableRowActionsProps<TData extends Residue> {
  row: Row<TData>,
  deleteResidue: (id: string, type: string) => void;
}

export function DataTableRowActions<TData extends Residue>({
  row,
  deleteResidue,
}: DataTableRowActionsProps<TData>) {
   const residue = row.original;

   const handleDelete = () => {
    deleteResidue(residue.id, residue.type);
   }

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Abrir menú</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem asChild>
             <Link href={`/dashboard/residues/create?id=${residue.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <AlertDialogTrigger asChild>
              <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el residuo de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
               onClick={handleDelete}
               className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
