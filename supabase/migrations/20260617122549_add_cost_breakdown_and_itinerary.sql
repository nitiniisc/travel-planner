alter table public.trips
  add column if not exists cost_breakdown jsonb,
  add column if not exists itinerary jsonb;
