
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function NeedsPage() {
  const hasNeeds = false; // This will be dynamic in the future

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mis Necesidades</h2>
          <p className="text-muted-foreground">
            Gestiona las solicitudes de residuos que tu empresa necesita.
          </p>
        </div>
      </div>
      
      {hasNeeds ? (
        // Data table will go here in the future
        <div>
            <p>Aquí se mostrará la tabla con tus necesidades publicadas.</p>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
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
