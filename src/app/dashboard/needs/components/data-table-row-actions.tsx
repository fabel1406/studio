// src/app/dashboard/needs/components/data-table-row-actions.tsx
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
} from "@/components/ui/alert-dialog"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Need } from "@/lib/types";
import { useState } from "react";


interface DataTableRowActionsProps<TData extends Need> {
  row: Row<TData>,
  deleteNeed: (id: string, type: string) => void;
}

export function DataTableRowActions<TData extends Need>({
  row,
  deleteNeed,
}: DataTableRowActionsProps<TData>) {
   const need = row.original;
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

   const handleDelete = () => {
    deleteNeed(need.id, need.residueType);
    setIsDeleteDialogOpen(false);
   }

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
             <Link href={`/dashboard/needs/create?id=${need.id}`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
           <DropdownMenuItem
                onSelect={() => setIsDeleteDialogOpen(true)}
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
              <Trash className="mr-2 h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente tu solicitud de nuestros servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>Cancelar</AlertDialogCancel>
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
