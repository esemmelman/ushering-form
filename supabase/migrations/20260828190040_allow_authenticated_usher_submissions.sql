grant insert on table public.usher_high_holiday_volunteers_2026_v1 to authenticated;

create policy "Signed-in visitors can submit usher availability"
  on public.usher_high_holiday_volunteers_2026_v1
  for insert
  to authenticated
  with check (true);
