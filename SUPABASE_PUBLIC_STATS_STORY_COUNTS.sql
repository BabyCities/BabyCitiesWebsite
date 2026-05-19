-- Add one safe aggregate payload for the landing page, so the website can
-- read only `public.public_stats` and stop querying `places` directly.
--
-- This function returns counts in the following shape:
-- {
--   "all": { "all": 1234, "stroller": 456, ... },
--   "1":   { "all": 120,  "stroller": 40,  ... }, -- restaurants
--   "2":   { "all": 320,  "stroller": 91,  ... }, -- cafes
--   ...
--   "10":  { "all": 18,   "stroller": 7,   ... }  -- entertainment
-- }
--
-- Type ids used here:
-- 1 restaurant
-- 2 cafe
-- 3 magasin
-- 4 parc
-- 5 plage
-- 6 musee
-- 7 aeroport
-- 8 gare
-- 9 service
-- 10 divertissements

create or replace function public.get_public_story_counts()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with type_options(type_id, type_key) as (
    values
      (null::bigint, 'all'),
      (1::bigint, '1'),
      (2::bigint, '2'),
      (3::bigint, '3'),
      (4::bigint, '4'),
      (5::bigint, '5'),
      (6::bigint, '6'),
      (7::bigint, '7'),
      (8::bigint, '8'),
      (9::bigint, '9'),
      (10::bigint, '10')
  ),
  filter_options(filter_name, filter_key) as (
    values
      (null::text, 'all'),
      ('highchair'::text, 'highchair'),
      ('stroller'::text, 'stroller'),
      ('changing'::text, 'changing'),
      ('nursing'::text, 'nursing'),
      ('microwave'::text, 'microwave'),
      ('playground_in'::text, 'playground_in'),
      ('playground_out'::text, 'playground_out')
  ),
  counts as (
    select
      t.type_key,
      f.filter_key,
      (
        select count(*)::bigint
        from public.places p
        where
          (t.type_id is null or p.type = t.type_id)
          and (
            f.filter_name is null
            or case f.filter_name
              when 'highchair' then coalesce(p.highchair, false)
              when 'stroller' then coalesce(p.stroller, false)
              when 'changing' then coalesce(p.changing, false)
              when 'nursing' then coalesce(p.nursing, false)
              when 'microwave' then coalesce(p.microwave, false)
              when 'playground_in' then coalesce(p.playground_in, false)
              when 'playground_out' then coalesce(p.playground_out, false)
              else false
            end
          )
      ) as total
    from type_options t
    cross join filter_options f
  ),
  per_type as (
    select
      type_key,
      jsonb_object_agg(filter_key, total order by filter_key) as filter_counts
    from counts
    group by type_key
  )
  select jsonb_object_agg(type_key, filter_counts order by type_key)
  from per_type;
$$;

comment on function public.get_public_story_counts() is
'Aggregate counts used by the marketing site through public_stats only.';

grant execute on function public.get_public_story_counts() to anon;

-- Next step:
-- Edit your existing `public.public_stats` view and add:
--
--   public.get_public_story_counts() as story_counts
--
-- Example shape only:
--
-- create or replace view public.public_stats as
-- select
--   s.places_count,
--   s.countries_count,
--   s.users_count,
--   public.get_public_story_counts() as story_counts
-- from (
--   -- keep your current logic for places_count / countries_count / users_count
-- ) s;
--
-- Once the website is confirmed to work from `public_stats` only, you can
-- tighten anonymous access:
--
-- revoke select on public.places from anon;
-- revoke select on public.place_types from anon;
-- Revoke or drop any older public count RPC only if you still have one.
--
-- If you want this file to fully set up your public stats view as well,
-- you can run the view definition below:

create or replace view public.public_stats as
select
  src.places_count,
  src.countries_count,
  src.users_count,
  public.get_public_story_counts() as story_counts
from (
  with place_country as (
    select
      p.id,
      matched_country.iso2
    from places p
    left join lateral (
      select cb.iso2
      from country_boundaries cb
      where st_covers(cb.geom, p."position")
      order by st_area(cb.geom)
      limit 1
    ) matched_country on true
  )
  select
    (select count(*) from places) as places_count,
    (
      select count(distinct place_country.iso2)
      from place_country
      where place_country.iso2 is not null
    ) as countries_count,
    (select count(*) from profiles) as users_count
) src;
