-- Schema, row level security, ratings view and RPC. Run once in the Supabase SQL editor.

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

-- Newer Supabase projects do not grant table access to anon by default; RLS above still applies.
grant select, insert, update, delete on public.recipes to anon;

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
