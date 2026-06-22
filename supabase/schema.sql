create table cookies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  shape text not null,
  base jsonb not null,
  mix_ins jsonb not null,
  topping jsonb not null,
  created_at timestamptz not null default now()
);

create table email_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now()
);
