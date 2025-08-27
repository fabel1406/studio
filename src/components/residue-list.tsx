
"use client";

import { useState } from "react";
import type { UserResidue } from "@/lib/types";
import { Button } from "./ui/button";
import { AddResidueDialog } from "./add-residue-dialog";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";

interface ResidueListProps {
    residues: UserResidue[];
    setResidues: React.Dispatch<React.SetStateAction<UserResidue[]>>;
    residueType: 'generated' | 'transformed';
}

export function ResidueList({ residues, setResidues, residueType }: ResidueListProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const addResidue = (residue: UserResidue) => {
        if (!residues.find(r => r.name.toLowerCase() === residue.name.toLowerCase())) {
            setResidues([...residues, residue]);
        }
    };

    const removeResidue = (id: string) => {
        setResidues(residues.filter(r => r.id !== id));
    };

    const dialogTitle = residueType === 'generated'
        ? "Añadir Residuo que Generas"
        : "Añadir Residue que Transformas";
    const dialogDescription = residueType === 'generated'
        ? "Selecciona o añade un nuevo tipo de residuo que produce tu empresa."
        : "Selecciona o añade un nuevo tipo de residuo que tu empresa puede procesar.";

    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-4">
                {residues.length > 0 ? (
                    residues.map(residue => (
                        <Badge key={residue.id} variant="secondary" className="text-base py-1 pl-3 pr-1">
                            {residue.name}
                            <button
                                onClick={() => removeResidue(residue.id)}
                                className="ml-2 rounded-full hover:bg-destructive/20 p-0.5"
                                aria-label={`Quitar ${residue.name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">Aún no has añadido ningún tipo de residuo.</p>
                )}
            </div>

            <AddResidueDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onAddResidue={addResidue}
                title={dialogTitle}
                description={dialogDescription}
            >
                <Button type="button" size="sm" onClick={() => setIsDialogOpen(true)}>
                    Añadir
                </Button>
            </AddResidueDialog>
        </div>
    );
}
