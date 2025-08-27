
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NeedsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Necesidades</h2>
          <p className="text-muted-foreground">
            Aquí tienes una lista de todos los residuos que has solicitado en el marketplace.
          </p>
        </div>
        <div className="flex items-center space-x-2">
            <Button>
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir Necesidad
            </Button>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            Aún no has publicado ninguna necesidad
          </h3>
          <p className="text-sm text-muted-foreground">
            Puedes empezar a solicitar residuos para encontrar ofertas de generadores.
          </p>
          <Button className="mt-4">
            <PlusCircle className="mr-2 h-4 w-4" /> Añadir Necesidad
          </Button>
        </div>
      </div>
    </div>
  );
}
