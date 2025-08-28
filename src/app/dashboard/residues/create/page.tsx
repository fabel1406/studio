// src/app/dashboard/residues/create/page.tsx
import { Suspense } from 'react';
import ResidueForm from './form';

export default function CreateResiduePage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <ResidueForm />
    </Suspense>
  );
}
