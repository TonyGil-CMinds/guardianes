# guardianes

App frontend construida con `Vite + React + Tailwind + Base44`.

## Desarrollo local

1. Instala dependencias con `npm install`
2. Crea un archivo `.env.local` a partir de `.env.example`
3. Completa al menos estas variables:

```env
VITE_BASE44_APP_ID=your_app_id
VITE_BASE44_APP_BASE_URL=https://your-base44-app.base44.app
```

4. Ejecuta `npm run dev`

## Deploy en Vercel

Este repo ya incluye:

- `vercel.json` con configuración para Vite
- rewrite SPA para que rutas como `/visor` y `/nominar` funcionen en producción
- `.env.example` con las variables necesarias

### Variables de entorno en Vercel

Configura estas variables en el proyecto de Vercel:

```env
VITE_BASE44_APP_ID=
VITE_BASE44_APP_BASE_URL=
VITE_BASE44_FUNCTIONS_VERSION=
BASE44_LEGACY_SDK_IMPORTS=false
```

### Build settings

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`

## Verificación rápida

- `npm run lint`
- `npm run build`

## Base44

Documentación: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

