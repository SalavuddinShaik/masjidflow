# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the React + TypeScript app.
- `src/components/` contains reusable UI pieces (e.g., `SplashScreen`).
- `src/pages/` contains page-level views (e.g., `Login`, `Otp`).
- `src/assets/` stores local images and SVGs used by the app.
- `public/` is for static files served as-is by Vite.
- `dist/` is the production build output (generated).
- Entry points: `src/main.tsx` (bootstrap) and `src/App.tsx` (top-level UI).

## Build, Test, and Development Commands
- `npm run dev` — start the Vite dev server with HMR.
- `npm run build` — type-check with `tsc -b` and build for production.
- `npm run preview` — serve the production build locally.
- `npm run lint` — run ESLint on the project.

## Coding Style & Naming Conventions
- Language: TypeScript + React (TSX).
- Indentation: 2 spaces; keep semicolons and current quote style consistent within each file.
- Components: `PascalCase` file and component names (e.g., `SplashScreen.tsx`).
- Hooks/handlers: `camelCase` (e.g., `onGetOtp`, `setScreen`).
- Linting: ESLint is configured in `eslint.config.js`; run `npm run lint` before PRs.

## Testing Guidelines
- No automated test runner is configured yet.
- If you add tests, co-locate near source or use `src/__tests__/` with `*.test.ts(x)` naming, and document the new command in this file.

## Commit & Pull Request Guidelines
- Current history uses short, imperative messages (e.g., “Add splash screen”).
- Keep commits focused; prefer one logical change per commit.
- PRs should include: a clear description, linked issue (if any), and UI screenshots/gifs for visual changes.

## Configuration Notes
- TypeScript configs live in `tsconfig*.json` and Vite config in `vite.config.ts`.
- Tailwind is present via `@tailwindcss/vite`; global styles live in `src/index.css`.
