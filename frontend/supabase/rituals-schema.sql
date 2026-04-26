-- Run this in the Supabase SQL Editor (dashboard → SQL Editor → New query)
-- https://supabase.com/dashboard/project/_/sql

create table if not exists rituals (
  id            text        primary key,                 -- slug, e.g. "mahashivratri-puja"
  category      text        not null,                   -- 'Festivals' | 'Daily Rituals' | 'Fasting' | 'Puja'
  title         text        not null,
  title_hindi   text,                                   -- optional Hindi title
  read_time     text        not null default '5 min read',
  hero_image    text,
  locked        boolean     not null default false,
  featured      boolean     not null default false,     -- shown in the top FeaturedBanner
  pull_quote    text,
  author_name   text        not null default 'Digi Pandit',
  author_avatar text,
  deity         text,                                   -- 'Shiva' | 'Vishnu' | 'Devi' | 'Ganesha' etc.
  content       jsonb       not null default '[]',      -- Block[] — see types in lib/rituals-api.ts
  likes         int         not null default 0,
  comments      int         not null default 0,
  source_url    text,                                   -- original scraped URL for attribution
  language      text        not null default 'en',      -- 'en' | 'hi'
  created_at    timestamptz          default now()
);

-- row-level security
alter table rituals enable row level security;

create policy "public_read_rituals"
  on rituals for select using (true);

create policy "service_write_rituals"
  on rituals for all using (auth.role() = 'service_role');
