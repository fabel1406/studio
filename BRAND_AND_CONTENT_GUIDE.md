# Guía de Marca y Contenido de EcoConnect

Este documento detalla la identidad visual, el tono y el contenido de cada página de la plataforma EcoConnect. Está diseñado para que cualquier desarrollador o diseñador pueda entender y replicar la aplicación de manera consistente.

---

## 1. Identidad de Marca y Guía de Estilo

### 1.1. Logotipo

- **Archivo:** `public/images/logo.png`
- **Descripción:** El logo es una imagen PNG con fondo transparente. Se muestra en un contenedor circular para asegurar que se vea bien en diferentes fondos.

### 1.2. Paleta de Colores

La paleta se define en `src/app/globals.css` usando variables CSS HSL, lo que permite una fácil personalización para los modos claro y oscuro.

**Modo Oscuro (Predeterminado):**
-   `--background`: `160 40% 8%` (Azul muy oscuro, casi negro)
-   `--foreground`: `210 40% 98%` (Blanco con un ligero tono azulado)
-   `--card`: `199 50% 12%` (Azul oscuro para las tarjetas)
-   `--primary`: `81 60% 56%` (Verde lima brillante, color principal de acción)
-   `--secondary`: `184 100% 33%` (Cian/turquesa, usado para acentos secundarios)
-   `--accent`: `184 100% 33%` (Igual que el secundario)
-   `--destructive`: `0 62.8% 30.6%` (Rojo oscuro para acciones destructivas)
-   `--border`: `199 50% 16%` (Borde azul oscuro, ligeramente más claro que el fondo de tarjeta)

**Modo Claro:**
-   `--background`: `210 60% 98%` (Blanco muy claro)
-   `--foreground`: `210 10% 20%` (Gris oscuro para el texto)
-   `--card`: `210 60% 100%` (Blanco puro para las tarjetas)
-   `--primary`: `81 60% 50%` (Verde lima, ligeramente más oscuro que en modo oscuro)
-   `--secondary`: `184 100% 30%` (Cian/turquesa, ligeramente más oscuro)
-   `--accent`: `184 100% 33%`
-   `--destructive`: `0 75% 55%` (Rojo brillante)
-   `--border`: `210 20% 88%` (Gris claro para los bordes)

### 1.3. Tipografía

- **Fuente Principal:** 'Inter', importada desde Google Fonts. Se usa para todo el texto, desde encabezados hasta párrafos.
- **Configuración:** Definida en `src/app/layout.tsx` y `tailwind.config.ts`.

### 1.4. Estilo de Componentes (ShadCN UI)

- **General:** Moderno, limpio y profesional.
- **Tarjetas (`Card`):** Son el elemento central de la UI. Usan esquinas redondeadas (`rounded-lg`), una sombra sutil (`shadow-sm` o `shadow-lg`) y un borde fino. Al pasar el cursor, tienen una transición que aumenta ligeramente la sombra (`hover:shadow-primary/20`) y eleva la tarjeta (`transform hover:-translate-y-2`).
- **Botones (`Button`):** Tienen esquinas redondeadas. El botón principal usa el color primario, mientras que los secundarios y de contorno (`outline`) son más sutiles.
- **Insignias (`Badge`):** Pequeños elementos con esquinas totalmente redondeadas para mostrar estados o categorías (ej. "Activo", "Verificado").
- **Iconografía:** Se utiliza la librería `lucide-react` para iconos limpios y consistentes.

---

## 2. Guía de Contenido por Página

### 2.1. Páginas Públicas

#### **Página de Inicio (`/`)**

- **Título (H1):** "Convierte tus Residuos en Recursos" con el subtítulo "en Recursos" destacado con un gradiente de color primario a secundario.
- **Párrafo principal:** "EcoConnect es el marketplace B2B donde los residuos orgánicos encuentran su valor. Conectamos generadores con transformadores para crear una economía circular y sostenible."
- **Botones de Acción:**
    - "Comenzar" (principal, lleva a `/register`)
    - "Explorar Marketplace" (secundario, lleva a `/dashboard/marketplace`)
- **Sección "¿Por qué EcoConnect?":**
    - **Título (H2):** "¿Por qué EcoConnect?"
    - **Párrafo:** "Desbloquea nuevas fuentes de ingresos, reduce tu huella ambiental y construye un modelo de negocio más sostenible."
    - **Tres tarjetas con iconos:**
        1.  **Beneficios Económicos:** "Convierte los costes de eliminación de residuos en beneficios. Accede a un nuevo mercado de compradores para tus residuos orgánicos y descubre materias primas a precios competitivos." (Icono: `DollarSign`)
        2.  **Impacto Ambiental:** "Contribuye a una economía circular desviando los residuos de los vertederos. Reduce las emisiones de CO₂ y promueve la valorización de los recursos para un planeta más saludable." (Icono: `Globe`)
        3.  **Responsabilidad Social:** "Mejora tu imagen corporativa, cumple tus objetivos de sostenibilidad y conéctate con una comunidad de empresas eco-conscientes dedicadas a marcar la diferencia." (Icono: `Users`)

#### **Página Para Generadores (`/for-generators`)**

- **Título (H1):** "Maximiza el Valor de tus Subproductos" con "Subproductos" destacado.
- **Párrafo:** "En EcoConnect, te proporcionamos las herramientas para convertir tus residuos orgánicos en activos valiosos. Conecta con una red de empresas listas para transformar tus subproductos en nuevos recursos."
- **Botón:** "Publica tu Residuo" (lleva a `/register`).
- **Imagen:** `public/images/residues/alperujo.jpg`.
- **Sección de Beneficios:**
    1.  **Nuevas Fuentes de Ingresos:** "Transforma lo que antes era un coste de gestión en una nueva línea de beneficios para tu empresa. Vende tus subproductos a una red de compradores verificados." (Icono: `DollarSign`)
    2.  **Sostenibilidad y Cumplimiento:** "Mejora la huella de carbono de tu empresa, cumple con tus objetivos de ESG (Environmental, Social, and Governance) y fortalece tu imagen de marca como líder en economía circular." (Icono: `Leaf`)
    3.  **Logística Eficiente:** "Nuestra plataforma simplifica la conexión y negociación con empresas transformadoras, reduciendo el tiempo y esfuerzo dedicado a encontrar salidas para tus residuos." (Icono: `Zap`)
- **Sección "Cómo Funciona":**
    1.  **01 - Publica tu Residuo:** "Crea una publicación detallada de tu residuo en minutos. Añade fotos, cantidad, ubicación y composición para atraer a los compradores adecuados."
    2.  **02 - Recibe Solicitudes y Ofertas:** "Los transformadores interesados te contactarán directamente a través de la plataforma. Gestiona todas tus negociaciones en un solo lugar."
    3.  **03 - Cierra el Trato:** "Acuerda los términos de precio, logística y entrega de forma segura. Valoriza tus residuos y contribuye a un ciclo productivo más sostenible."

#### **Página Para Transformadores (`/for-transformers`)**

- **Título (H1):** "Asegura tu Materia Prima Sostenible" con "Sostenible" destacado.
- **Párrafo:** "EcoConnect es tu fuente directa de materias primas secundarias. Accede a un mercado B2B de residuos orgánicos, optimiza tu cadena de suministro y lidera la innovación en la economía circular."
- **Botón:** "Explorar Marketplace" (lleva a `/dashboard/marketplace`).
- **Imagen:** `public/images/residues/poda-olivo.jpg`.
- **Sección de Beneficios:**
    1.  **Acceso a Materia Prima:** "Encuentra un flujo constante y diverso de residuos orgánicos para tus procesos de transformación, desde biomasa hasta subproductos agroindustriales." (Icono: `Package`)
    2.  **Optimización de Costes:** "Reduce tus costes de adquisición de materia prima accediendo a recursos locales a precios competitivos. Negocia directamente con los generadores para obtener los mejores tratos." (Icono: `Recycle`)
    3.  **Calidad y Trazabilidad:** "Conecta con generadores verificados que proporcionan información detallada sobre la composición y calidad de sus residuos, asegurando la idoneidad para tus procesos." (Icono: `ShieldCheck`)
- **Sección "Cómo Funciona":**
    1.  **01 - Busca o Publica tu Necesidad:** "Explora el marketplace en busca de los residuos que necesitas o publica una 'necesidad' para que los generadores te encuentren y te hagan ofertas."
    2.  **02 - Solicita y Negocia:** "Contacta directamente con los generadores para solicitar muestras, negociar precios y acordar las condiciones de entrega y logística."
    3.  **03 - Asegura tu Suministro:** "Cierra acuerdos a corto o largo plazo para garantizar un suministro constante y fiable de materia prima, impulsando tu producción de forma sostenible."

#### **Página Sobre Nosotros (`/about`)**

- **Título (H1):** "Nuestra Misión: Revalorizar Cada Residuo" con "Revalorizar Cada Residuo" destacado.
- **Párrafo:** "En EcoConnect, estamos dedicados a transformar el paradigma de los residuos. Creemos que cada subproducto industrial es un recurso potencial, y nuestra plataforma está diseñada para conectar a los visionarios que comparten esta creencia."
- **Sección "La Historia de EcoConnect":**
    - **Título (H2):** "La Historia de EcoConnect"
    - **Párrafos:** "Nacimos de la simple observación de una ineficiencia masiva: por un lado, empresas generando toneladas de residuos orgánicos con un alto coste de gestión; por otro, industrias buscando materias primas sostenibles y asequibles. Vimos una desconexión, y la tecnología nos dio la herramienta para construir el puente. EcoConnect comenzó como un proyecto para optimizar la logística de residuos en la industria agroalimentaria. Rápidamente, nos dimos cuenta del potencial para crear un verdadero marketplace B2B, un ecosistema donde la economía circular no fuera solo un concepto, sino una realidad rentable y escalable. Hoy, nuestra plataforma impulsa la innovación y la sostenibilidad en múltiples sectores."
- **Sección "Nuestros Valores":**
    - **Título (H2):** "Nuestros Valores Fundamentales"
    - **Párrafo:** "Estos principios guían cada decisión que tomamos y cada línea de código que escribimos."
    - **Cuatro tarjetas:**
        1.  **Sostenibilidad:** "Creemos en un futuro donde los negocios prosperan respetando el planeta."
        2.  **Innovación:** "Aplicamos la tecnología para resolver desafíos ambientales complejos."
        3.  **Colaboración:** "Fomentamos una comunidad de empresas que trabajan juntas por un objetivo común."
        4.  **Transparencia:** "Construimos confianza a través de la comunicación abierta y la trazabilidad."

#### **Página de Registro (`/register`)**

- **Título:** "Crear una cuenta"
- **Descripción:** "Únete a EcoConnect y empieza a convertir residuos en valor."
- **Formulario:** Campos para correo electrónico, contraseña y un selector de rol ("Generador de Residuos", "Transformador de Residuos", "Ambos").
- **Enlace:** "¿Ya tienes una cuenta? Iniciar sesión" (lleva a `/login`).

#### **Página de Inicio de Sesión (`/login`)**

- **Título:** "¡Bienvenido de nuevo!"
- **Descripción:** "Introduce tus credenciales para acceder a tu cuenta."
- **Formulario:** Campos para correo electrónico y contraseña.
- **Enlace:** "¿No tienes una cuenta? Regístrate" (lleva a `/register`).

#### **Política de Privacidad (`/privacy`)**

- **Título:** "Política de Privacidad"
- **Contenido:**
    1.  **Introducción:** Compromiso de proteger la privacidad y el propósito de la política.
    2.  **Recopilación de información:** Detalla los datos recopilados (personales, de empresa, derivados por el servidor).
    3.  **Uso de su información:** Explica cómo se utilizan los datos para gestionar cuentas, facilitar la comunicación, mejorar la plataforma, etc.
    4.  **Seguridad de su información:** Describe las medidas de seguridad implementadas.
    5.  **Contacto:** Proporciona un correo electrónico de contacto (`privacidad@ecoconnect.com`).

#### **Términos de Servicio (`/terms`)**

- **Título:** "Términos de Servicio"
- **Contenido:**
    1.  **Acuerdo de los Términos:** Establece que el uso de la plataforma implica la aceptación de los términos.
    2.  **Cuentas de Usuario:** Responsabilidades del usuario sobre la seguridad de su cuenta.
    3.  **Contenido del Usuario:** Responsabilidad del usuario sobre la información que publica.
    4.  **Terminación:** Derecho de la plataforma a suspender o cancelar cuentas.
    5.  **Ley Aplicable:** Especifica que las leyes de España rigen los términos.
    6.  **Contacto:** Proporciona un correo electrónico de soporte (`soporte@ecoconnect.com`).

### 2.2. Páginas del Panel de Control (Dashboard)

#### **Resumen (`/dashboard`)**

- **Función:** Muestra una vista general de la actividad del usuario.
- **Contenido:**
    - **Tarjetas de métricas clave:** "Listados Activos", "Negociaciones Activas", "CO₂ Evitado (kg)".
    - **Gráfico de Impacto:** Visualización del impacto mensual (Residuos Desviados vs. CO₂ Evitado).
    - **Lista de Negociaciones Recientes:** Muestra las últimas 5 negociaciones con un enlace para ver los detalles y un botón para ver todas.

#### **Marketplace (`/dashboard/marketplace`)**

- **Función:** Es el núcleo de la plataforma, donde los usuarios descubren oportunidades.
- **Contenido:**
    - **Botones de acción rápida:** "Añadir Residuo" y/o "Publicar Necesidad" según el rol del usuario.
    - **Sección de Sugerencias con IA:** Un botón para buscar recomendaciones y una sección de carrusel para mostrar los resultados (tarjetas de residuos o necesidades recomendadas).
    - **Filtros:** Filtros básicos por tipo, categoría y país. Un diálogo de "Filtros avanzados" para rangos de cantidad, precio y ciudad.
    - **Dos pestañas:**
        1.  **Residuos Disponibles:** Una cuadrícula de `ResidueCard` que muestra todos los residuos publicados, con paginación y filtros.
        2.  **Necesidades del Mercado:** Una cuadrícula de `NeedCard` con las necesidades publicadas.

#### **Mis Residuos (`/dashboard/residues`)**

- **Función:** Permite a los generadores gestionar sus publicaciones de residuos.
- **Contenido:**
    - **Título:** "Mis Publicaciones de Residuos".
    - **Botón:** "Añadir Publicación".
    - **Tabla de datos:** Muestra una lista de los residuos del usuario con columnas para "Tipo", "Categoría", "Cantidad", "Estado".
    - **Acciones por fila:** Editar y Eliminar la publicación.
    - **Vista vacía:** Si no hay residuos, muestra un mensaje para animar al usuario a crear su primera publicación.

#### **Crear/Editar Residuo (`/dashboard/residues/create`)**

- **Función:** Formulario para añadir o modificar una publicación de residuo.
- **Contenido:** Campos para:
    - Tipo de Residuo (con opción para un tipo personalizado)
    - Categoría
    - Cantidad y Unidad
    - Precio por Unidad (opcional)
    - Estado (Activo, Reservado, Cerrado)
    - Descripción
    - País y Ciudad

#### **Mis Necesidades (`/dashboard/needs`)**

- **Función:** Permite a los transformadores gestionar sus solicitudes.
- **Contenido:** Similar a la página de "Mis Residuos", pero para necesidades.
    - **Tabla de datos:** Muestra las necesidades del usuario con columnas para "Tipo", "Categoría", "Cantidad", "Estado".
    - **Acciones:** Editar y Eliminar.

#### **Crear/Editar Necesidad (`/dashboard/needs/create`)**

- **Función:** Formulario para añadir o modificar una solicitud de materia prima.
- **Contenido:** Campos para:
    - Tipo de Residuo Buscado
    - Categoría
    - Cantidad y Unidad
    - Frecuencia de la necesidad (única, semanal, mensual)
    - Especificaciones Adicionales
    - País y Ciudad

#### **Negociaciones (`/dashboard/negotiations`)**

- **Función:** Gestiona todas las interacciones comerciales.
- **Contenido:**
    - **Dos pestañas:** "Negociaciones Recibidas" y "Negociaciones Enviadas" (los títulos varían según el rol del usuario para ser más específicos).
    - **Lista de negociaciones:** Cada elemento muestra el tipo de residuo, la otra empresa involucrada, la cantidad, el precio (si lo hay), el estado y un botón para "Ver Negociación".

#### **Detalle de Negociación (`/dashboard/negotiations/[id]`)**

- **Función:** Espacio de trabajo para una negociación específica.
- **Contenido:**
    - **Detalles del Trato:** Residuo, cantidad, precio, estado actual.
    - **Información de la Otra Parte:** Tarjeta con el nombre y ubicación de la otra empresa.
    - **Panel de Acciones:** Botones para "Aceptar", "Rechazar", "Modificar" o "Cancelar" la negociación, dependiendo del rol del usuario y el estado del trato.
    - **Chat Integrado:** Un componente de chat para la comunicación directa entre las dos partes.

#### **Coincidencias Inteligentes (`/dashboard/matches`)**

- **Función:** Utiliza la IA para sugerir socios comerciales de forma proactiva.
- **Contenido:**
    - Se listan las publicaciones activas del usuario (sus residuos o sus necesidades).
    - Para cada publicación, hay un botón "Encontrar Coincidencias".
    - Al hacer clic, la IA devuelve una lista de las 3 mejores contrapartes, cada una con una puntuación de compatibilidad, una razón explicativa y un botón para "Iniciar Negociación".

#### **Impacto (`/dashboard/impact`)**

- **Función:** Visualiza el impacto positivo generado por el usuario y la plataforma.
- **Contenido:**
    - **Tarjetas de métricas totales:** "Residuos Desviados (kg)", "CO₂ Evitado (kg)", "Valor Económico Generado".
    - **Gráfico de barras:** Muestra el desglose mensual de "Residuos Desviados" y "CO₂ Evitado".

#### **Ajustes (`/dashboard/settings`)**

- **Función:** Permite al usuario configurar su perfil y el de su empresa.
- **Contenido:** Formulario para editar:
    - Nombre de la empresa
    - Correo de la cuenta (no editable)
    - Descripción de la empresa
    - Dirección (país, ciudad, calle)
    - Datos de contacto públicos (email, teléfono, sitio web)
    - Rol principal en la plataforma (Generador, Transformador, Ambos)
