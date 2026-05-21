# CasaAI — Plataforma inmobiliaria con IA

CasaAI es una plataforma SaaS inmobiliaria multi-tenant inspirada en ZonaProp, construida con Next.js 16 y Tailwind CSS v4. Integra búsqueda inteligente con score de match por IA, mapas interactivos, y paneles diferenciados para compradores e inmobiliarias.

---

## Tecnologías

| Categoría | Tecnología |
|---|---|
| Framework | Next.js 16.2.6 (App Router) |
| Lenguaje | TypeScript (strict mode) |
| Estilos | Tailwind CSS v4 (CSS-first, sin config file) |
| Estado global | Zustand con `persist` middleware |
| Formularios | React Hook Form + Zod v4 + @hookform/resolvers |
| Mapas | Leaflet + react-leaflet (open source, sin API key) |
| Animaciones | Framer Motion |
| Íconos | Lucide React |
| Data fetching | TanStack Query (React Query v5) |
| Fuentes | Playfair Display (títulos) + DM Sans (cuerpo) |
| Node.js requerido | v20.9.0 o superior |

---

## Instalación y uso local

```bash
# Clonar el repositorio
git clone <url-del-repo>
cd propflow-web

# Instalar dependencias
npm install

# Crear el archivo de entorno
cp .env.example .env.local
# Editar NEXT_PUBLIC_API_URL si corresponde

# Levantar el servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Credenciales de prueba

| Rol | Email | Contraseña |
|---|---|---|
| Comprador | juan@casaai.com | cualquiera |
| Inmobiliaria | admin@reinvent.com | cualquiera |

---

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx                        # Landing page (/)
│   ├── layout.tsx                      # Root layout (fuentes, leaflet CSS)
│   ├── globals.css                     # Tailwind v4 @theme, variables de color
│   │
│   ├── (public)/                       # Rutas públicas con Navbar + Footer
│   │   ├── layout.tsx
│   │   ├── propiedades/
│   │   │   ├── page.tsx                # Listado con filtros y mapa
│   │   │   └── [id]/page.tsx           # Detalle de propiedad
│   │   ├── inversion/page.tsx          # Placeholder
│   │   ├── servicios/page.tsx          # Placeholder
│   │   └── contacto/page.tsx          # Placeholder
│   │
│   ├── (auth)/                         # Rutas de autenticación (split-screen)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── registro/page.tsx
│   │
│   └── (dashboard)/                    # Panel privado (sidebar layout)
│       ├── layout.tsx                  # Sidebar con nav por rol
│       ├── usuario/                    # Dashboard comprador
│       │   ├── page.tsx
│       │   ├── guardadas/page.tsx
│       │   ├── alertas/page.tsx
│       │   ├── busquedas/page.tsx
│       │   └── perfil/page.tsx
│       └── inmobiliaria/               # Dashboard inmobiliaria
│           ├── page.tsx
│           ├── propiedades/page.tsx
│           ├── consultas/page.tsx
│           ├── estadisticas/page.tsx
│           ├── config/page.tsx
│           └── publicar/page.tsx
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                  # Navbar sticky con blur, mobile drawer
│   │   └── Footer.tsx                  # Footer oscuro con links
│   ├── shared/
│   │   ├── AIMatchBadge.tsx            # Badge de score IA (color por rango)
│   │   └── PriceTag.tsx                # Precio formateado con variantes
│   ├── properties/
│   │   ├── PropertyCard.tsx            # Card con animación Framer Motion
│   │   ├── PropertyGrid.tsx            # Grid responsivo
│   │   ├── PropertyFilters.tsx         # Panel de filtros lateral
│   │   ├── PropertyListingClient.tsx   # Página de listado (client)
│   │   ├── PropertyMap.tsx             # Mapa Leaflet con markers de precio
│   │   ├── PropertyMapClient.tsx       # Wrapper 'use client' + dynamic import
│   │   ├── ImageGallery.tsx            # Galería con lightbox y miniaturas
│   │   └── ContactCard.tsx             # Formulario de contacto al agente
│   └── search/
│       └── SearchBar.tsx               # Barra de búsqueda con autocompletado
│
├── store/
│   ├── useAuthStore.ts                 # Auth (Zustand persist), mock users
│   └── useSearchStore.ts               # Filtros de búsqueda activos
│
├── hooks/
│   ├── useProperties.ts                # TanStack Query sobre mockData
│   └── useTenant.ts                    # Tenant activo (placeholder)
│
├── lib/
│   ├── utils.ts                        # cn(), formatPrice(), formatSurface()
│   ├── constants.ts                    # DEFAULT_TENANT, labels, ciudades, features
│   ├── mockData.ts                     # 6 propiedades de prueba
│   ├── api.ts                          # Cliente HTTP base (get/post/put/delete)
│   └── validations.ts                  # Schemas Zod para login y registro
│
└── types/
    ├── property.ts                     # Property, PropertyType, OperationType, Filters
    └── tenant.ts                       # Tenant interface
```

---

## Estado actual — qué está construido

### Landing page (`/`)

- Hero con SearchBar integrada y fondo con imagen
- Sección de propiedades destacadas (cards con score IA)
- Sección de pitch de IA ("¿Cómo funciona el match?")
- Sección de inversión / ROI
- CTA final con fondo degradado
- Navbar sticky con efecto blur al hacer scroll
- Footer con links y redes

### Listado de propiedades (`/propiedades`)

- Filtros laterales: operación, tipo, rango de precio (ARS/USD), ambientes, comodidades
- Vista grilla y vista mapa (toggle)
- Mapa Leaflet con marcadores de precio, highlight al hover
- Ordenamiento (precio, superficie, match IA)
- Drawer de filtros en mobile (bottom sheet)
- Compatibilidad Next.js 16: `searchParams` como Promise

### Detalle de propiedad (`/propiedades/[id]`)

- Galería de fotos con lightbox y miniaturas
- Estadísticas: superficie, ambientes, baños, año
- Grilla de comodidades
- Mapa de ubicación (Leaflet)
- Formulario de contacto al agente con WhatsApp
- Sección de propiedades similares
- Compatibilidad Next.js 16: `params` como Promise

### Autenticación

**Login (`/login`)**
- Formulario con React Hook Form + Zod
- Mostrar/ocultar contraseña
- Recordarme
- Error global (banner)
- Hint de credenciales demo
- Redirección por rol (`/usuario` o `/inmobiliaria`)

**Registro (`/registro`)**
- Selector de rol con cards visuales (comprador / inmobiliaria)
- Nombre, email, contraseña con medidor de fortaleza (4 barras)
- Confirmar contraseña
- Checkbox de términos
- Redirección por rol

### Dashboard — Comprador (`/usuario`)

| Página | Descripción |
|---|---|
| `/usuario` | Resumen: banner IA, stats rápidas, propiedades guardadas, búsquedas recientes, tip de mercado |
| `/usuario/guardadas` | Grilla de guardadas con filtro Todas/Venta/Alquiler, botón de quitar |
| `/usuario/alertas` | CRUD de alertas: toggle activar/pausar, eliminar, formulario nueva alerta |
| `/usuario/busquedas` | Lista de búsquedas guardadas con filtros aplicados, "Ver resultados", eliminar |
| `/usuario/perfil` | Barra de completitud, datos personales (RHF+Zod), preferencias IA (tipo, ambientes, ciudad, presupuesto) |

### Dashboard — Inmobiliaria (`/inmobiliaria`)

| Página | Descripción |
|---|---|
| `/inmobiliaria` | KPIs (activas, visitas, consultas, conversión), tabla de propiedades, feed de consultas recientes, tip de rendimiento |
| `/inmobiliaria/propiedades` | Tabla con búsqueda y filtro por estado, menú por fila (ver/editar/pausar/eliminar) |
| `/inmobiliaria/consultas` | Inbox expandible con historial, responder inline, cerrar consulta, tabs Nueva/Respondida/Cerrada |
| `/inmobiliaria/estadisticas` | KPI cards, gráfico de barras semanal, fuentes de tráfico, top propiedades — switcher 7/30/90 días |
| `/inmobiliaria/config` | Datos de la agencia (form), notificaciones (toggles), color de marca, seguridad |
| `/inmobiliaria/publicar` | Wizard 4 pasos: tipo y operación → ubicación → características → precio y fotos |

---

## Decisiones de arquitectura

### Multi-tenant (pendiente)
La arquitectura contempla multi-tenancy: cada inmobiliaria tiene su propio subdominio (`agencia.casaai.com`). El middleware de Next.js leerá el host y cargará el tenant correspondiente. Actualmente el tenant está hardcodeado como `DEFAULT_TENANT` en `src/lib/constants.ts`. La implementación del middleware está pendiente.

### Datos mock
Todo el contenido es ficticio: 6 propiedades en `src/lib/mockData.ts`, usuarios de prueba en `useAuthStore`. La capa de API real se conecta a través de `src/lib/api.ts` y `src/hooks/useProperties.ts` (TanStack Query), listos para reemplazar los mocks.

### Compatibilidad Next.js 16
`searchParams` y `params` en Server Components son Promises y deben ser `await`eados. Los componentes con `dynamic(() => ..., { ssr: false })` deben estar en archivos `'use client'`.

### Tailwind CSS v4
Configuración CSS-first: sin `tailwind.config.js`. Los tokens de diseño (colores, fuentes) se definen en el bloque `@theme` de `src/app/globals.css`.

---

## Pendiente / roadmap

- [ ] Middleware de multi-tenancy (detección de subdominio)
- [ ] Integración con API real (reemplazar mocks)
- [ ] Páginas de contenido: `/inversion`, `/servicios`, `/contacto`
- [ ] Carga real de imágenes en `/inmobiliaria/publicar`
- [ ] Motor de match IA (backend)
- [ ] Autenticación real (JWT / sesiones)
- [ ] Panel de administración (`/admin`)
- [ ] Internacionalización (i18n)
- [ ] Tests (Vitest + Testing Library)

---

## Colores de marca

| Token | Valor | Uso |
|---|---|---|
| `--color-brand-500` | `#1A6B5A` | Color principal (botones, badges, links) |
| `--color-brand-900` | `#104538` | Degradados oscuros |
| `--color-surface-*` | Grises `#F9F9F7` / `#F2F1EE` | Fondos de página y cards |

---

## Scripts disponibles

```bash
npm run dev       # Servidor de desarrollo (Turbopack)
npm run build     # Build de producción
npm run start     # Servidor de producción
npm run lint      # ESLint
```
