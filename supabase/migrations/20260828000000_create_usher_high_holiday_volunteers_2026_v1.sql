create table public.usher_high_holiday_volunteers_2026_v1 (
  usher_volunteer_id uuid primary key default gen_random_uuid(),
  usher_volunteer_name text not null
    check (char_length(btrim(usher_volunteer_name)) between 1 and 100),
  usher_service_selections text[] not null
    check (
      cardinality(usher_service_selections) between 1 and 5
      and usher_service_selections <@ array[
        'erev_rosh_hashana',
        'rosh_hashana',
        'kol_nidre',
        'yom_kippur_morning',
        'yom_kippur_afternoon_evening'
      ]::text[]
    ),
  usher_submitted_at timestamptz not null default now()
);

create unique index usher_high_holiday_volunteers_2026_v1_name_unique
  on public.usher_high_holiday_volunteers_2026_v1 (lower(btrim(usher_volunteer_name)));

alter table public.usher_high_holiday_volunteers_2026_v1 enable row level security;

revoke all on table public.usher_high_holiday_volunteers_2026_v1 from anon, authenticated;
grant insert on table public.usher_high_holiday_volunteers_2026_v1 to anon;

create policy "Public can submit usher availability"
  on public.usher_high_holiday_volunteers_2026_v1
  for insert
  to anon
  with check (true);

comment on table public.usher_high_holiday_volunteers_2026_v1 is
  'Public 2026 High Holiday usher sign-ups; isolated from all other bnaimitzvah app tables.';
