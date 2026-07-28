-- À exécuter dans Supabase : Dashboard > SQL Editor > New query

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  uid text unique,
  nom text not null,
  email text not null unique,
  phone text,
  address text not null,
  reference text not null,
  whatsapp_referant text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  email text,
  text text not null,
  stars int default 0,
  created_at timestamptz default now()
);

-- Sécurité : la clé "service_role" utilisée dans la Serverless Function
-- contourne le Row Level Security (RLS), donc tu peux laisser RLS activé
-- par défaut sans créer de policy publique. Rien d'autre n'est exposé
-- côté client puisque seule la fonction Vercel utilise cette clé.
alter table public.users enable row level security;
alter table public.reviews enable row level security;
