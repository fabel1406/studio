// src/app/dashboard/needs/create/page.tsx
import { Suspense } from 'react';
import NeedForm from './form';

export default function CreateNeedPage() {
  return (
    <Suspense fallback={<div>Cargando formulario...</div>}>
      <NeedForm />
    </Suspense>
  );
}
