# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SORT4U is a lifestyle/productivity web app for students offering calorie tracking, memory lane reminders, and budget tracking. Early-stage project with a React frontend and a placeholder Python backend (no implementation yet).

## Repository Structure

```
sort4u_2nd/
├── frontend/    # React 19 SPA (Vite + Tailwind CSS 4)
├── backend/     # Python backend (empty scaffolding only)
```

## Frontend Commands

All commands run from the `frontend/` directory:

```bash
npm run dev       # Start dev server with HMR
npm run build     # Production build (output: dist/)
npm run lint      # ESLint (v9 flat config)
npm run preview   # Preview production build locally
```

No test framework is configured.

## Tech Stack

- **React 19** with JSX (no TypeScript)
- **Vite 7** as build tool
- **React Router DOM v7** for client-side routing
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **shadcn/ui** components (new-york style, lucide icons) — config in `components.json`
- **class-variance-authority** + **clsx** + **tailwind-merge** for component variants

## Architecture

**Entry flow**: `main.jsx` → `<BrowserRouter>` + `<StrictMode>` → `App.jsx` (route definitions)

**Routes** (defined in `App.jsx`):
- `/` → `pages/LandingPage.jsx`
- `/login` → `feature/login.jsx`
- `/signup` → not yet implemented

**Frontend src layout**:
- `pages/` — full page components
- `feature/` — feature-specific components (login form)
- `components/ui/` — reusable shadcn-style UI primitives (Button)
- `lib/utils.js` — `cn()` helper (clsx + tailwind-merge)
- `assets/` — images (PNG/SVG)

**Path alias**: `@` maps to `frontend/src` (configured in both `vite.config.js` and `jsconfig.json`).

## Styling

Tailwind CSS with HSL CSS custom properties for theming. Custom color tokens (background, foreground, primary, secondary, border, ring) defined in `tailwind.config.js`. Mobile-first responsive design using standard Tailwind breakpoints.
