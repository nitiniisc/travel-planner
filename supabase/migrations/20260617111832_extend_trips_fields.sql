alter table public.trips
  add column if not exists travelers integer,
  add column if not exists group_type text,
  add column if not exists vibe text,
  add column if not exists terrain text,
  add column if not exists budget_inr integer,
  add column if not exists starting_city text,
  add column if not exists reason text,
  add column if not exists best_time text,
  add column if not exists estimated_budget text,
  add column if not exists duration text,
  add column if not exists tags text[],
  add column if not exists highlights text[];
