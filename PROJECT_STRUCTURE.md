# Arquitectura y Estructura del Proyecto EcoConnect

Este documento proporciona una visión general de alto nivel de la estructura de carpetas y archivos del proyecto. Está diseñado para ayudar a los desarrolladores a entender dónde se encuentra cada pieza de la lógica y cómo interactúan entre sí.

## 1. Visión General de la Tecnología

-   **Framework:** Next.js (con App Router)
-   **Lenguaje:** TypeScript
-   **UI:** React, ShadCN UI, Tailwind CSS
-   **Inteligencia Artificial:** Genkit
-   **Autenticación:** Firebase Auth
-   **Base de Datos (Simulada):** Servicios en memoria (`/src/services`)

---

## 2. Estructura de Carpetas Principal

```
.
├── src/
│   ├── app/            # Enrutamiento y páginas de la aplicación (Next.js App Router)
│   ├── components/     # Componentes de React reutilizables
│   ├── lib/            # Funciones de utilidad, tipos y datos simulados
│   ├── services/       # Lógica de acceso a datos (simula una base de datos)
│   └── ai/             # Lógica relacionada con la IA (Genkit)
├── public/             # Archivos estáticos (imágenes, etc.)
├── next.config.ts      # Configuración de Next.js
├── tailwind.config.ts  # Configuración de Tailwind CSS
└── package.json        # Dependencias y scripts del proyecto
```

---

### 2.1. `src/app` - El Corazón de la Aplicación

Esta carpeta utiliza el **App Router** de Next.js. La estructura de carpetas define directamente las rutas de la URL.

-   **`src/app/layout.tsx`**: El layout raíz que envuelve toda la aplicación. Importa las fuentes, los estilos globales (`globals.css`) y aplica el `ThemeProvider` para el modo oscuro/claro.
-   **`src/app/page.tsx`**: La página de inicio (`/`).
-   **`src/app/(public)`**: Un [grupo de rutas](https://nextjs.org/docs/app/building-your-application/routing/route-groups) para las páginas públicas que comparten un layout común (`(public)/layout.tsx` que incluye `Header` y `Footer`).
    -   `about/`, `for-generators/`, `for-transformers/`, `login/`, `register/`, `terms/`, `privacy/`.
-   **`src/app/dashboard`**: La sección privada de la aplicación, protegida por autenticación.
    -   **`dashboard/layout.tsx`**: El layout principal del panel de control. Contiene la barra lateral de navegación (`Sidebar`), el encabezado del panel y el `RoleProvider` que gestiona el rol del usuario.
    -   **`dashboard/role-provider.tsx`**: Un contexto de React crucial que gestiona el estado de autenticación del usuario (a través de Firebase Auth), su rol (`GENERATOR`, `TRANSFORMER`, `BOTH`) y su ID de compañía simulado.
    -   **`dashboard/page.tsx`**: La página principal del panel o "Resumen".
    -   **`dashboard/marketplace/page.tsx`**: El marketplace donde los usuarios descubren residuos y necesidades.
    -   **`dashboard/residues/page.tsx`**: La tabla que lista los residuos publicados por el usuario.
    -   **`dashboard/residues/create/page.tsx`**: El formulario para crear o editar una publicación de residuo.
    -   **`dashboard/residues/[id]/page.tsx`**: La página de detalle de un residuo específico.
    -   **`dashboard/needs/...`**: Estructura similar a `residues` pero para gestionar las necesidades.
    -   **`dashboard/negotiations/...`**: Páginas para listar y ver el detalle de las negociaciones.
    -   **`dashboard/matches/page.tsx`**: La página de "Coincidencias Inteligentes" donde la IA sugiere socios.
    -   **`dashboard/settings/page.tsx`**: La página de ajustes del perfil de la empresa.

### 2.2. `src/components` - Bloques de Construcción de la UI

Aquí residen todos los componentes de React reutilizables.

-   **`components/ui`**: Contiene los componentes base de la librería **ShadCN UI** (Button, Card, Input, etc.). Estos son los bloques de construcción fundamentales.
-   **`components/header.tsx`, `footer.tsx`**: Componentes para el encabezado y pie de página de las páginas públicas.
-   **`components/logo.tsx`**: El componente del logo de EcoConnect.
-   **`components/residue-card.tsx`**, **`components/need-card.tsx`**: Las tarjetas que se muestran en el marketplace.
-   **`components/analysis-panel.tsx`**: El panel de análisis con IA que se muestra en las páginas de detalle.
-   **`components/negotiation-chat.tsx`**: El componente de chat para las negociaciones.
-   **`components/offer-dialog.tsx`**: El diálogo modal para crear o editar una oferta en una negociación.

### 2.3. `src/lib` - Utilidades y Datos

Esta carpeta contiene código de soporte que no son componentes de React ni páginas.

-   **`lib/types.ts`**: **Muy importante.** Define todas las estructuras de datos clave de la aplicación usando TypeScript (`Residue`, `Need`, `Company`, `Negotiation`, etc.).
-   **`lib/data.ts`**: Contiene los datos **simulados (mock data)** que alimentan la aplicación. Actúa como nuestra base de datos en memoria.
-   **`lib/firebase.ts`**: Configura e inicializa la conexión con Firebase.
-   **`lib/locations.ts`**: Proporciona una lista de países y ciudades para los formularios.
-   **`lib/utils.ts`**: Contiene la función de utilidad `cn` de ShadCN para combinar clases de Tailwind CSS de forma condicional.

### 2.4. `src/services` - La Capa de Datos

Esta carpeta es fundamental. **Abstrae la lógica para obtener y manipular los datos de la aplicación.** Aunque actualmente opera sobre los datos simulados en `lib/data.ts`, está diseñada para que en el futuro se pueda reemplazar fácilmente por llamadas a una base de datos real (como Firestore) sin tener que cambiar el código de las páginas.

-   **`company-service.ts`**: Funciones para obtener información de las compañías.
-   **`residue-service.ts`**: Funciones para crear, leer, actualizar y eliminar (`CRUD`) residuos.
-   **`need-service.ts`**: Funciones CRUD para las necesidades.
-   **`negotiation-service.ts`**: Funciones para gestionar todo el ciclo de vida de las negociaciones.

### 2.5. `src/ai` - El Cerebro de la IA

Aquí reside toda la lógica de Inteligencia Artificial, construida con **Genkit**.

-   **`ai/genkit.ts`**: Archivo de configuración central de Genkit. Define el modelo de lenguaje a utilizar (ej. Gemini).
-   **`ai/flows`**: Contiene los "flujos" de Genkit, que son las funciones que interactúan con la IA.
    -   **`match-suggestions.ts`**: El flujo más complejo. Recibe un residuo o una necesidad y una lista de contrapartes, y le pide a la IA que encuentre las mejores coincidencias con una puntuación y una razón.
    -   **`residue-details.ts`**: Genera una descripción mejorada para un residuo, sugiriendo usos potenciales y beneficios.
    -   **`need-details.ts`**: Genera un análisis estratégico para una necesidad, sugiriendo posibles fuentes de suministro.
