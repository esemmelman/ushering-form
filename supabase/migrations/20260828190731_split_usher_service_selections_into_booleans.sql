alter table public.usher_high_holiday_volunteers_2026_v1
  add column usher_erev_rosh_hashana_selected boolean not null default false,
  add column usher_rosh_hashana_selected boolean not null default false,
  add column usher_kol_nidre_selected boolean not null default false,
  add column usher_yom_kippur_morning_selected boolean not null default false,
  add column usher_yom_kippur_afternoon_evening_selected boolean not null default false;

update public.usher_high_holiday_volunteers_2026_v1
set
  usher_erev_rosh_hashana_selected = 'erev_rosh_hashana' = any(usher_service_selections),
  usher_rosh_hashana_selected = 'rosh_hashana' = any(usher_service_selections),
  usher_kol_nidre_selected = 'kol_nidre' = any(usher_service_selections),
  usher_yom_kippur_morning_selected = 'yom_kippur_morning' = any(usher_service_selections),
  usher_yom_kippur_afternoon_evening_selected = 'yom_kippur_afternoon_evening' = any(usher_service_selections);

alter table public.usher_high_holiday_volunteers_2026_v1
  drop column usher_service_selections,
  add constraint usher_high_holiday_volunteers_2026_v1_service_selected_check
    check (
      usher_erev_rosh_hashana_selected
      or usher_rosh_hashana_selected
      or usher_kol_nidre_selected
      or usher_yom_kippur_morning_selected
      or usher_yom_kippur_afternoon_evening_selected
    );
