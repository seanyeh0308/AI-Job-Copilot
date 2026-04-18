create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analyses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  job_title text,
  company_name text,
  jd_text text not null,
  resume_text text not null,
  selected_modules text[] not null default '{}',
  status text not null default 'draft' check (status in ('draft', 'processing', 'completed', 'failed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses(id) on delete cascade,
  module text not null check (module in ('resume_optimization', 'interview_qa', 'match_analysis')),
  result_json jsonb not null,
  created_at timestamptz not null default now(),
  unique (analysis_id, module)
);

create table if not exists public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  analysis_id uuid references public.analyses(id) on delete set null,
  action text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  stripe_customer_id text,
  stripe_subscription_id text,
  status text,
  amount integer,
  currency text,
  raw_payload jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists analyses_set_updated_at on public.analyses;
create trigger analyses_set_updated_at
before update on public.analyses
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.analyses enable row level security;
alter table public.analysis_results enable row level security;
alter table public.usage_logs enable row level security;
alter table public.payment_records enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "analyses_select_own" on public.analyses;
drop policy if exists "analyses_insert_own" on public.analyses;
drop policy if exists "analyses_update_own" on public.analyses;
drop policy if exists "analyses_delete_own" on public.analyses;
create policy "analyses_select_own" on public.analyses for select using (auth.uid() = user_id);
create policy "analyses_insert_own" on public.analyses for insert with check (auth.uid() = user_id);
create policy "analyses_update_own" on public.analyses for update using (auth.uid() = user_id);
create policy "analyses_delete_own" on public.analyses for delete using (auth.uid() = user_id);

drop policy if exists "analysis_results_select_own" on public.analysis_results;
create policy "analysis_results_select_own" on public.analysis_results
for select using (
  exists (
    select 1 from public.analyses
    where analyses.id = analysis_results.analysis_id
    and analyses.user_id = auth.uid()
  )
);

drop policy if exists "analysis_results_insert_own" on public.analysis_results;
create policy "analysis_results_insert_own" on public.analysis_results
for insert with check (
  exists (
    select 1 from public.analyses
    where analyses.id = analysis_results.analysis_id
    and analyses.user_id = auth.uid()
  )
);

drop policy if exists "analysis_results_delete_own" on public.analysis_results;
create policy "analysis_results_delete_own" on public.analysis_results
for delete using (
  exists (
    select 1 from public.analyses
    where analyses.id = analysis_results.analysis_id
    and analyses.user_id = auth.uid()
  )
);

drop policy if exists "usage_logs_select_own" on public.usage_logs;
drop policy if exists "usage_logs_insert_own" on public.usage_logs;
create policy "usage_logs_select_own" on public.usage_logs for select using (auth.uid() = user_id);
create policy "usage_logs_insert_own" on public.usage_logs for insert with check (auth.uid() = user_id);

drop policy if exists "payment_records_select_own" on public.payment_records;
create policy "payment_records_select_own" on public.payment_records for select using (auth.uid() = user_id);
