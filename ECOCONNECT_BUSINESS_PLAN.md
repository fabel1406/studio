
# EcoConnect: Manual de Funcionamiento y Plan de Negocio

## 1. Visión General y Misión

**EcoConnect** es un marketplace B2B (empresa a empresa) de alta tecnología, diseñado para catalizar la economía circular mediante la conexión eficiente de generadores de residuos orgánicos con empresas que pueden transformarlos en recursos valiosos.

Nuestra **misión** es transformar el paradigma de los residuos industriales, convirtiendo lo que tradicionalmente ha sido un coste logístico y medioambiental en una fuente de ingresos para los generadores y en una materia prima sostenible y asequible para los transformadores. Buscamos ser el ecosistema digital de referencia para la economía circular en el sector orgánico.

---

## 2. Manual de Funcionamiento de la Plataforma

Esta sección detalla el funcionamiento de cada componente de la plataforma desde la perspectiva del usuario.

### 2.1. Actores Principales

La plataforma está diseñada para dos roles principales que pueden ser complementarios:

1.  **Generadores:** Empresas cuya actividad principal produce subproductos o residuos orgánicos (ej. almazaras, bodegas, aserraderos, industria alimentaria, cerveceras). Su objetivo es vender o encontrar una salida gestionada para sus residuos.
2.  **Transformadores:** Empresas que utilizan materia prima orgánica para crear nuevos productos (ej. plantas de biogás, productores de compost, fabricantes de pellets de biomasa, farmacéuticas, alimentación animal). Su objetivo es encontrar un suministro constante y fiable de materia prima.

Un usuario puede registrarse con un rol o con **"Ambos"** si su actividad empresarial abarca las dos facetas.

### 2.2. Flujo de Usuario Detallado

#### Paso 1: Registro y Configuración del Perfil
*   **Registro:** El usuario crea una cuenta con su correo y contraseña. Durante el registro, debe seleccionar su rol principal: "Generador", "Transformador" o "Ambos".
*   **Perfil de la Empresa:** Una vez registrado, el usuario accede a la sección "Ajustes" de su panel de control. Aquí debe completar la información de su empresa, que incluye:
    *   Nombre de la empresa.
    *   Descripción de la actividad.
    *   Datos de contacto (email público, teléfono).
    *   Dirección completa (país, ciudad, dirección).
    *   Sitio web.
*   **Verificación:** La plataforma incluye un estado de "Verificado". Las empresas pueden solicitar la verificación aportando documentación adicional (no implementado en la fase inicial). Un perfil verificado genera más confianza en el marketplace.

#### Paso 2: Operaciones en el Marketplace

El marketplace es el corazón de EcoConnect. Aquí los usuarios pueden publicar sus ofertas y demandas.

*   **Publicar un Residuo (Generadores):**
    1.  Desde el panel, ir a "Mis Residuos" y hacer clic en "Añadir Publicación".
    2.  Rellenar el formulario con:
        *   **Tipo de Residuo:** Ej. "Alperujo", "Serrín de pino", "Bagazo de cerveza". Se puede elegir de una lista o especificar uno nuevo.
        *   **Categoría:** BIOMASS, FOOD, AGRO, OTHERS.
        *   **Cantidad y Unidad:** Ej. 50 TON.
        *   **Precio por Unidad (Opcional):** Si se deja en blanco, se considera "Negociable".
        *   **Descripción:** Detalles sobre la composición, humedad, contaminantes, etc.
        *   **Fotos:** Subir imágenes claras del residuo.
    3.  Al guardar, la publicación aparecerá en el marketplace y en el perfil del generador.

*   **Publicar una Necesidad (Transformadores):**
    1.  Desde el panel, ir a "Mis Necesidades" y hacer clic en "Publicar Necesidad".
    2.  Rellenar el formulario con:
        *   **Tipo de Residuo Buscado:** Ej. "Poda de olivo".
        *   **Categoría:** La categoría del residuo que busca.
        *   **Cantidad y Unidad:** Ej. 100 TON.
        *   **Frecuencia:** "Solo una vez", "Semanalmente", "Mensualmente".
        *   **Especificaciones:** Requisitos de calidad, humedad máxima, etc.
    3.  La necesidad se publica en el marketplace para que los generadores puedan encontrarla y hacer ofertas.

#### Paso 3: Descubrimiento y Matchmaking con IA

*   **Exploración y Filtros:** Cualquier usuario puede navegar por el marketplace, usando filtros por tipo de residuo, categoría, país y filtros avanzados (cantidad, precio).
*   **Motor de Coincidencias IA (Página "Coincidencias"):**
    1.  El usuario navega a la sección "Coincidencias" en su panel.
    2.  La IA le presenta sus publicaciones activas (residuos o necesidades).
    3.  Al hacer clic en "Encontrar Coincidencias", la IA analiza todas las contrapartes disponibles y sugiere los socios más compatibles basándose en:
        *   **Compatibilidad del material:** Coincidencia exacta o cercana del tipo de residuo.
        *   **Proximidad geográfica:** Prioriza conexiones locales.
        *   **Volumen:** Compara la cantidad ofertada con la necesitada.
    4.  Los resultados se presentan con una **puntuación de compatibilidad** (ej. 95%) y una razón explicativa.

*   **Análisis Mejorado por IA (Páginas de Detalle):**
    *   Al ver el detalle de un residuo o necesidad, el usuario puede usar la función "Generar Análisis con IA".
    *   La IA enriquece la descripción, sugiriendo usos potenciales, beneficios medioambientales, estrategias de suministro y puntos clave para hacerlo más atractivo.

#### Paso 4: Sistema de Negociación

1.  **Inicio:** Una negociación se puede iniciar de dos formas:
    *   Un **Transformador** solicita un residuo que ha visto en el marketplace.
    *   Un **Generador** hace una oferta sobre una necesidad que ha visto publicada.
2.  **Panel de Negociaciones:** Todas las negociaciones (enviadas y recibidas) se gestionan desde esta sección. Se dividen en "Recibidas" y "Enviadas".
3.  **Chat Integrado:** Cada negociación abre un chat privado donde ambas partes pueden:
    *   Discutir términos y logística.
    *   Ajustar cantidades y precios (el iniciador puede modificar la oferta).
4.  **Aceptación/Rechazo:**
    *   La parte que recibe la oferta inicial tiene los botones para "Aceptar" o "Rechazar".
    *   Al aceptar, el trato se cierra y se registra en la plataforma.
    *   Al rechazar, la negociación se marca como cerrada.

#### Paso 5: Panel de Impacto

*   Esta sección visualiza el impacto positivo agregado de las transacciones cerradas en la plataforma.
*   Muestra métricas clave (simuladas en la fase actual):
    *   **Toneladas de residuos desviados** de vertederos.
    *   **Kg de CO₂ equivalentes evitados.**
    *   **Valor económico generado** (estimado a partir de los precios de las transacciones).

---

## 3. Modelo de Negocio

El modelo de negocio de EcoConnect es flexible y está diseñado para crecer junto con su comunidad de usuarios. Se basa en varias fuentes de ingresos.

### 3.1. Comisión por Transacción (Modelo Principal)

*   **Concepto:** EcoConnect cobra una pequeña comisión (ej. **2-5%**) sobre el valor total de cada acuerdo cerrado exitosamente a través de la plataforma. El valor se calcula como `cantidad * precio_acordado`.
*   **Implementación:** Cuando una negociación se marca como "Aceptada" y tiene un precio definido, el sistema calcula la comisión.
*   **Ventajas:** Es un modelo justo ("win-win"), ya que la plataforma solo genera ingresos si sus usuarios también lo hacen. Alinea el éxito de EcoConnect con el de sus clientes.

### 3.2. Modelo de Suscripción "Freemium" (Complementario)

Se ofrece un plan gratuito con funcionalidades esenciales y planes de pago con características avanzadas para usuarios con alto volumen de negocio.

*   **Plan Gratuito (Básico):**
    *   Registro y creación de perfil.
    *   Publicación de un número limitado de residuos/necesidades (ej. hasta 3 activas simultáneamente).
    *   Acceso al marketplace y a las coincidencias de IA básicas.
    *   Iniciar un número limitado de negociaciones al mes.

*   **Plan Premium (Pro/Enterprise):**
    *   **Dirigido a:** Grandes generadores o transformadores.
    *   **Precio:** Una cuota fija mensual/anual (ej. 49€/mes).
    *   **Beneficios:**
        *   Publicaciones ilimitadas y destacadas en el marketplace (mayor visibilidad).
        *   Acceso a analíticas avanzadas (precios de mercado, tendencias de demanda/oferta).
        *   Herramientas de IA más potentes (ej. predicción de disponibilidad de residuos por zona).
        *   Soporte técnico prioritario.
        *   Insignia de "Socio Premium" para mayor confianza y credibilidad en el perfil.
        *   Negociaciones ilimitadas.

### 3.3. Servicios de Valor Añadido (Opcionales a futuro)

1.  **Verificación y Certificación de Calidad:**
    *   Un servicio de pago donde EcoConnect (o un socio externo) verifica la calidad y composición de un lote de residuos mediante análisis de laboratorio.
    *   Las publicaciones con "Certificado de Calidad EcoConnect" tendrán mayor visibilidad, confianza y podrán justificar un precio superior.

2.  **Logística Simplificada:**
    *   Integración con APIs de empresas de logística para que, al cerrar un trato, los usuarios puedan cotizar y contratar el transporte directamente desde la plataforma. EcoConnect obtendría una comisión por cada servicio logístico contratado.

3.  **Data as a Service (DaaS):**
    *   A largo plazo, los datos agregados y anónimos de la plataforma son extremadamente valiosos. Se pueden vender informes de inteligencia de mercado a consultoras, organismos gubernamentales o grandes corporaciones sobre flujos de residuos, precios y tendencias en la economía circular.
