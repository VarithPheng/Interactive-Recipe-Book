# Interactive Recipe Book: Build Spec

A public recipe book in React for a university frontend final project. Read this whole file before writing code. It is the source of truth; if something here conflicts with your assumptions, follow this file.

## How to work

- Build in the milestones listed under "Build order". After each milestone run `bunx tsc --noEmit` and `bun run build`, and fix errors before moving on.
- Ask the user for credentials (Supabase URL/anon key, R2 keys). Never invent values and never commit secrets. Leave `// TODO(user):` comments for steps that need the user's accounts.
- Keep shared files stable: `src/App.tsx` routes, `src/lib/types.ts`, and the two context files. Change them deliberately and tell the user.
- The grader scores React concepts, so keep `useState`, `useEffect`, Context and custom hooks visible and commented. Do not hide them behind libraries.
- Do NOT add: dark mode or a theme toggle (light theme only), authentication, Zod, a Pantry Finder page, a client-side data cache layer, a units (metric/imperial) toggle, TanStack Query, or Redux.

## Goal and grading

Course project, 100 points. Requirements:

- At least 5 distinct pages/views (routing, organized by component)
- React Context for global state
- `useState` and `useEffect` used effectively
- Data persistence at least at browser level (localStorage / IndexedDB)
- Deployed publicly (Vercel)
- 90%+ of planned functionality (the checklist below)
- Responsive, user-friendly UI/UX
- Deliverables: live URL, GitHub repo with clear README, 1-2 page report

## Stack (locked)

| Area | Choice |
| --- | --- |
| Build/framework | Vite + React 18 + TypeScript |
| Package manager | Bun (`bun install`, `bun add`, `bun run`, `bunx`); commit `bun.lock`, no `package-lock.json` |
| Routing | `react-router-dom` v6 |
| UI | Tailwind CSS + shadcn/ui (Button, Card, Input, Select, Textarea, Badge, Skeleton, AlertDialog, Sonner toasts) |
| Global state | React Context + `useReducer` |
| Forms | `react-hook-form` with its built-in validation rules (no Zod) |
| Database | Supabase Postgres via `@supabase/supabase-js`, no auth |
| Photos | Cloudflare R2 via a presigned PUT URL from a Vercel function |
| Hosting | Vercel (static build + `/api` function) |

## Locked decisions

- **No login.** Everyone sees the same recipes. Ownership is the `can_delete` boolean: recipes created through the app have `can_delete = true`; the 6 seeded recipes have `can_delete = false` and cannot be updated or deleted by the public key. This is enforced by Row Level Security, not just the UI.
- **Favorites** live in localStorage per device. `is_featured` is a separate read-only "Staff pick" flag set only in SQL.
- **Ratings** are 1-5 stars, one per device (`device_id` from localStorage), written only through an RPC.
- **No offline cache.** If the API fails, show an error state with a retry button.
- **Filtering and sorting are client-side.** Fetch all recipes once, then filter with `useMemo`.

## Pages and routes (5 pages + 404)

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | `BrowsePage` | Grid, search, category and ingredient filters, sort |
| `/recipes/:id` | `RecipeDetailPage` | Photo, ingredients with servings scaler, steps, rating, favorite, share, edit/delete |
| `/recipes/new` and `/recipes/:id/edit` | `RecipeFormPage` | One form component, create and edit modes |
| `/favorites` | `FavoritesPage` | Recipes favorited on this device |
| `/about` | `AboutPage` | Project info, team, repo link |
| `*` | `NotFoundPage` | Not-found state |

All pages render inside a `Layout` (navbar with links, mobile menu, `<Outlet/>`). Set `document.title` per page in a `useEffect`.

## Feature checklist (acceptance criteria)

| # | Feature | Page | Done when |
| --- | --- | --- | --- |
| F1 | Seeded recipe grid | Browse | 6 seeded recipes appear on first load |
| F2 | Debounced title search | Browse | Typing filters after ~300 ms (`useDebounce`) |
| F3 | Category filter | Browse | Chips/select for the 7 categories plus "All" |
| F4 | Ingredient include/exclude filter | Browse | Add ingredient chips; each chip toggles "must include" or "must exclude"; matching uses `ingredientNames` |
| F5 | Sort | Browse | Newest, quickest (prep time), top rated |
| F6 | Staff pick badge and filter | Browse | Badge on featured cards; toggle to show only featured |
| F7 | Recipe detail and servings scaler | Detail | Quantities scale with servings; quantities rounded to 2 decimals |
| F8 | Add recipe, validated | Form | Rules below; inline errors; success toast and redirect to detail |
| F9 | Edit own recipe | Form | Prefilled form; only when `canDelete` |
| F10 | Delete own recipe | Detail | AlertDialog confirm; seeded recipes show a lock badge and no buttons |
| F11 | Photo upload | Form | Pick, preview, resize to WebP, upload to R2, save URL |
| F12 | Favorite toggle and page | Detail, Favorites | Heart toggle on cards and detail; persists across refresh |
| F13 | Ratings | Detail, Browse | Click 1-5 stars; average and count shown on cards; own rating remembered |
| F14 | Share link | Detail | Copy button puts the full detail URL on the clipboard, toast confirms |
| F15 | ~~Dark mode~~ | n/a | Removed by user decision (light theme only). Numbering kept so other IDs stay stable. |
| F16 | Responsive layout | All | Usable at 375, 768 and 1280 px; grid is 1/2/3/4 columns |
| F17 | Loading, error and empty states, toasts | All | Skeletons while loading, error with retry, friendly empty states |

Form validation rules (`react-hook-form` rules, inline messages):

- `title`: required, 2-80 characters
- `category`: required, one of the 7 categories
- `ingredients`: at least 1 row; each row needs `name` (required) and `qty` (number > 0); `unit` from the unit list
- `steps`: at least 1 step, each non-empty
- `prepMinutes`: integer 1-1440; `servings`: integer 1-100
- `photo`: optional; image/jpeg, image/png or image/webp; max 5 MB before resize
- Use `useFieldArray` for ingredient and step rows.

## Types (`src/lib/types.ts`)

```ts
export const CATEGORIES = ['Breakfast','Main','Soup','Salad','Dessert','Snack','Drink'] as const
export type Category = typeof CATEGORIES[number]
export const UNITS = ['g','kg','ml','l','tsp','tbsp','cup','piece','pinch'] as const
export type Unit = typeof UNITS[number]

export type Ingredient = { name: string; qty: number; unit: Unit }

export type Recipe = {
  id: string
  title: string
  description: string | null
  category: Category
  ingredients: Ingredient[]
  ingredientNames: string[]   // lowercase, trimmed; derived from ingredients on write
  steps: string[]
  prepMinutes: number | null
  servings: number | null
  photoUrl: string | null
  canDelete: boolean
  isFeatured: boolean
  createdAt: string
  avgRating: number           // 0 when no ratings
  ratingCount: number
}

export type RecipeInput = Omit<Recipe,
  'id' | 'ingredientNames' | 'canDelete' | 'isFeatured' | 'createdAt' | 'avgRating' | 'ratingCount'>
```

## Database (`supabase/001_init.sql`)

Run in the Supabase SQL editor.

```sql
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 2 and 80),
  description text,
  category text not null,
  ingredients jsonb not null,
  ingredient_names text[] not null,
  steps text[] not null,
  prep_minutes int,
  servings int,
  photo_url text,
  can_delete boolean not null default true,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.recipes enable row level security;

create policy recipes_select on public.recipes for select using (true);
create policy recipes_insert on public.recipes for insert
  with check (can_delete = true and is_featured = false);
create policy recipes_update on public.recipes for update
  using (can_delete = true)
  with check (can_delete = true and is_featured = false);
create policy recipes_delete on public.recipes for delete
  using (can_delete = true);

create table public.ratings (
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  device_id text not null check (char_length(device_id) between 8 and 64),
  score smallint not null check (score between 1 and 5),
  primary key (recipe_id, device_id)
);
-- RLS on with no policies: the public key cannot read or write ratings directly.
alter table public.ratings enable row level security;

create view public.recipes_with_rating as
select r.*,
       coalesce(avg(x.score), 0)::numeric(3,2) as avg_rating,
       count(x.score)::int as rating_count
from public.recipes r
left join public.ratings x on x.recipe_id = r.id
group by r.id;

grant select on public.recipes_with_rating to anon;

create or replace function public.rate_recipe(
  p_recipe_id uuid, p_device_id text, p_score smallint
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_score < 1 or p_score > 5 then
    raise exception 'invalid score';
  end if;
  insert into public.ratings (recipe_id, device_id, score)
  values (p_recipe_id, p_device_id, p_score)
  on conflict (recipe_id, device_id) do update set score = excluded.score;
end $$;

grant execute on function public.rate_recipe(uuid, text, smallint) to anon;
```

Notes: the view runs with its owner's rights so it can aggregate ratings while the table stays locked; the Supabase linter may warn about this and it is intentional. Verify the policies by testing, with the anon key, that inserting with `can_delete = false` fails and that deleting a seeded recipe affects 0 rows.

### Seed data (`supabase/seed.sql`)

Insert 6 realistic recipes with `can_delete = false` and `is_featured = true` on 2 or 3 of them, across at least 4 categories. Each has 5+ ingredients, 4+ steps, `prep_minutes`, `servings`, and a `photo_url` pointing to an R2 image the user uploaded. `ingredient_names` must be the lowercase names of the `ingredients` entries. Run the seed in the SQL editor (it bypasses RLS).

## Data access (`src/api/`)

- `src/lib/supabase.ts` creates the client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.
- `src/api/recipes.ts`:
  - `fetchRecipes()`: `from('recipes_with_rating').select('*').order('created_at', { ascending: false })`, mapped from snake_case to the `Recipe` type by a single `mapRow` function.
  - `createRecipe(input)`: insert into `recipes` (never the view), computing `ingredient_names`, then `.select().single()` and re-read the row from the view by id.
  - `updateRecipe(id, input)` and `deleteRecipe(id)`: against `recipes`. Throw if the response affects 0 rows (that means RLS refused it).
- `src/api/ratings.ts`: `rateRecipe(recipeId, deviceId, score)` calls `supabase.rpc('rate_recipe', {...})`.
- `src/api/upload.ts`: `uploadPhoto(blob)` calls `/api/upload`, PUTs the blob to the returned URL, returns the public URL.
- All functions throw on error; the contexts catch and show toasts.

## Photo upload

Client (`hooks/useImageUpload.ts` + `lib/image.ts`):

1. Validate type (jpeg/png/webp) and size (<= 5 MB).
2. Resize so the longest side is <= 1200 px using a canvas, export as `image/webp` (quality about 0.8).
3. Show a preview with `URL.createObjectURL`; revoke it in the `useEffect` cleanup.
4. On form submit, upload first, then save the recipe with `photoUrl`.

Server (`api/upload.ts`, Vercel function, Node runtime):

- `POST` with JSON `{ contentType, size }`.
- Reject unless `contentType === 'image/webp'` and `size <= 2_000_000`.
- Key: `recipes/${crypto.randomUUID()}.webp`.
- Use `@aws-sdk/client-s3` with `endpoint: https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`, `region: 'auto'`, and `@aws-sdk/s3-request-presigner` to presign a `PutObjectCommand` (`ContentType` signed) with `expiresIn: 60`.
- Return `{ uploadUrl, publicUrl: `${R2_PUBLIC_URL}/${key}` }`.
- The client PUTs with header `Content-Type: image/webp`.
- R2 bucket CORS: allow `PUT` from the production origin and `http://localhost:3000`, header `Content-Type`.
- Local testing needs `vercel dev` (plain `vite` does not run `/api`).

## State and hooks

Providers wrap the app in `main.tsx` in this order: `FavoritesProvider`, `RecipesProvider`, router. Each context file exports a provider and a consumer hook (`useRecipes`, `useFavorites`) that throws a clear error if used outside its provider. Add a short comment block at the top of each provider explaining what state it owns and why.

**`RecipesContext`** (`useReducer`)

- State: `{ items: Recipe[], status: 'loading' | 'success' | 'error', error: string | null }`.
- A `useEffect` calls `fetchRecipes()` on mount; expose `reload()` for the retry button.
- Actions: `create`, `update`, `remove`, `rate`. For `remove` and `rate`, update state optimistically and roll back (with a toast) if the request fails. For `create` and `update`, wait for the server, then update state.
- Rating state: after `rateRecipe` succeeds, update that recipe's `avgRating` and `ratingCount` locally (or refetch that row).

**`FavoritesContext`**

- Array of recipe ids via `useLocalStorage('recipebook:favorites:v1', [])` with `toggle(id)` and `isFavorite(id)`.
- When recipes finish loading, prune ids that no longer exist.
- A `useEffect` listens for the window `storage` event so other tabs stay in sync.

**Custom hooks (`src/hooks/`)**

- `useLocalStorage<T>(key, initial)`: `useState` initialised from storage inside a try/catch (bad JSON falls back to `initial`), and a `useEffect` that writes on change.
- `useDebounce<T>(value, ms)`.
- `useImageUpload()`: handles validate, resize, preview URL, upload and its loading/error state.

**Other local storage keys:** `recipebook:device-id` (generated once with `crypto.randomUUID()`, used for ratings) and `recipebook:my-ratings:v1` (map of recipe id to the user's score, so their own stars show after refresh).

## Filtering and sorting rules (Browse)

- Search matches the lowercase title containing the debounced query.
- Category: exact match, or all.
- Ingredient chips: each chip is `include` or `exclude`. A recipe passes only if every include name matches some entry in `ingredientNames` (substring match, case-insensitive) and no exclude name matches.
- Featured toggle: only `isFeatured`.
- Sort: newest (`createdAt` desc), quickest (`prepMinutes` asc, nulls last), top rated (`avgRating` desc, then `ratingCount` desc).
- Compute the final list with `useMemo`. Keep filter state in the Browse page with `useState`; do not put it in a context.

## UI and UX requirements

- Mobile-first Tailwind; breakpoints for the 1/2/3/4 column grid.
- Skeleton cards while loading; an error panel with a retry button if the fetch fails; empty states for no results and no favorites.
- Accessible: labelled inputs, visible focus, alt text on images, buttons that are real `<button>`s, enough contrast. Target Lighthouse accessibility 90+.
- Recipe cards show photo (with a neutral placeholder when none), title, category badge, prep time, average rating, heart, and a lock/"Staff pick" badge where relevant.
- Use Sonner toasts for success and error messages.

## Folder structure

```
recipe-book/
├─ api/upload.ts
├─ supabase/ 001_init.sql, seed.sql
├─ .github/workflows/keepalive.yml     # optional weekly ping
├─ public/
├─ src/
│  ├─ main.tsx, App.tsx
│  ├─ pages/        BrowsePage, RecipeDetailPage, RecipeFormPage, FavoritesPage, AboutPage, NotFoundPage
│  ├─ components/
│  │  ├─ layout/    Layout, Navbar
│  │  ├─ recipe/    RecipeCard, RecipeGrid, FilterBar, IngredientChips, StarRating, ServingsScaler, PhotoPicker
│  │  └─ ui/        (shadcn)
│  ├─ context/      RecipesContext, FavoritesContext
│  ├─ hooks/        useLocalStorage, useDebounce, useImageUpload
│  ├─ lib/          supabase, types, image, device, utils
│  └─ api/          recipes, ratings, upload
├─ .env.example, vercel.json, README.md, CLAUDE.md
```

## Environment variables

`.env.example` (commit this, never the real `.env`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
# Server-only (set in Vercel and in .env.local for `vercel dev`; never prefix with VITE_)
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
```

## Deployment

- `vercel.json` must rewrite page routes (no file extension, not `/api`) to the SPA so deep links survive a refresh. It also skips Vite dev paths (`/src`, `/@...`, `/node_modules`), otherwise `vercel dev` serves `index.html` for JS modules and the page is blank:

```json
{ "rewrites": [{ "source": "/((?!api/|src/|@|node_modules/)[^.]*)", "destination": "/index.html" }] }
```

- Set all environment variables in the Vercel project, then redeploy.
- Deploy the empty scaffold on day 1 so deployment problems surface early.
- Optional keep-alive: `.github/workflows/keepalive.yml` runs weekly and requests `${SUPABASE_URL}/rest/v1/recipes?select=id&limit=1` with the anon key headers, so the free Supabase project does not pause before grading.
- Before submission: confirm the Supabase project is awake, open the live URL, refresh on `/recipes/<id>`, and test add, photo upload, rating and delete on the live site.

## Build order (milestones)

1. **Scaffold:** Vite + TS, Tailwind, shadcn init, router with 5 stub pages + 404, `Layout`, `types.ts`, `.env.example`, `vercel.json`. Deploy to Vercel.
2. **Data layer:** run the SQL, seed, `supabase.ts`, `api/recipes.ts`, `RecipesContext` (fetch, loading/error), `FavoritesContext`, `useLocalStorage`.
3. **Read path:** Browse grid, `RecipeCard`, search, category, ingredient chips, sort, featured toggle, Detail page with servings scaler, share button.
4. **Write path:** `RecipeFormPage` with `react-hook-form` rules and `useFieldArray`, create and edit, delete with AlertDialog, lock badge for protected recipes.
5. **Photos:** `api/upload.ts`, R2 + CORS, `useImageUpload`, preview and upload in the form.
6. **Extras:** ratings (RPC, `StarRating`, remembered score), favorites page and heart, Staff pick.
7. **Polish:** loading/error/empty states, toasts, responsive pass at 375/768/1280, accessibility pass, Lighthouse.
8. **Deliverables:** README, comments on providers and hooks, keep-alive workflow, final live test.

## Conventions

- TypeScript strict mode, no `any`. Function components only. Named exports for components.
- Keep components small; put data access in `src/api`, never inside page components.
- Never use array indexes as keys for lists that can change; use `id`.
- Commit messages are short and specific (`feat: add ingredient filter chips`).
- Comments: a header comment on each context provider and custom hook describing its state, its effects and why it exists.

## Definition of done

- All 16 active features in the checklist (F15 removed) work on the live URL.
- Seeded recipes cannot be edited or deleted even by calling the API with the anon key.
- Refreshing any route on the live site works.
- `bunx tsc --noEmit` and `bun run build` pass with no errors.
- README contains: what the app is, screenshots, the feature checklist with every item ticked and its page, local setup steps (including `vercel dev` and env variables), the architecture note (contexts and hooks), and the live and repository links.
- Report (1-2 pages) is written separately and includes the repository and live links.
