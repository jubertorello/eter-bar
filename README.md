# ETER Bar

Landing page del bar ETER (menú, promos, galería, horarios) con un panel de administración en `/admin`.

**Stack:** React 19 + Vite + Tailwind CSS 3, datos en Supabase e imágenes/videos en Cloudinary. Deploy en Vercel.

## Desarrollo local

1. `npm install`
2. Crear `.env.local` con:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_CLOUDINARY_CLOUD_NAME=...
   VITE_CLOUDINARY_UPLOAD_PRESET=...
   ```
3. `npm run dev` (http://localhost:3000)

## Estructura

- `src/pages/LandingPage.tsx` — web pública
- `src/pages/AdminDashboard.tsx` — gestión de tragos, promos y galería
- `src/context/AppContext.tsx` — estado y acceso a Supabase (`eter_menu_items`, `eter_promos`, `eter_gallery`, `eter_settings`)
- `constants.ts` — horarios, WiFi, ubicación y contacto
