# Travel Planner

A Next.js 16 (App Router) app with Supabase email/password authentication.

## Stack

- Next.js 16 (Turbopack)
- Supabase (`@supabase/ssr`, `@supabase/supabase-js`)
- Tailwind CSS
- Playwright for end-to-end tests

## Getting started

Install dependencies:

```bash
npm install
```

Set your Supabase project credentials in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Auth

- `app/signup/page.tsx` / `app/login/page.tsx` — email/password sign-up and login via Supabase.
- `lib/supabase/client.ts` / `lib/supabase/server.ts` — browser and server Supabase client helpers built on `@supabase/ssr`.
- `proxy.ts` — Next.js 16 renamed the `middleware` file convention to `proxy`; this file checks the Supabase session and redirects unauthenticated requests to `/dashboard`, `/plan`, and `/history` to `/login`.

The `supabase/` directory holds the linked Supabase project config (`supabase config push` syncs it to the hosted project).

## Testing

End-to-end tests run with Playwright against a production build (`next build && next start`), not `next dev` — see `playwright.config.ts`.

```bash
npm run test:e2e
```

`tests/auth.spec.ts` covers sign-up, login, and that protected routes redirect to `/login` when unauthenticated.
