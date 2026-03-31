-- Aqbobek Lyceum Portal MVP
-- Run in Supabase SQL Editor

create extension if not exists pgcrypto;

create type public.app_role as enum ('student', 'teacher', 'parent', 'admin');
create type public.feed_type as enum ('announcement', 'schedule', 'achievement');
create type public.achievement_category as enum ('olympiad', 'sport', 'volunteering', 'art');

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  role public.app_role not null,
  grade text,
  class_name text,
  linked_student_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  external_ref text unique,
  full_name text not null,
  grade text not null,
  class_name text not null,
  streak_days int not null default 0,
  xp int not null default 0,
  goals_closed int not null default 0,
  parent_name text,
  avatar text,
  created_at timestamptz not null default now()
);

create table if not exists public.subject_performance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  subject_id text not null,
  subject_name text not null,
  teacher_name text not null,
  attendance_missed int not null default 0,
  next_exam_date date,
  scores jsonb not null default '[]'::jsonb,
  assessments jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  title text not null,
  category public.achievement_category not null,
  verified boolean not null default false,
  issuer text,
  achievement_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  audience text[] not null default '{all}',
  type public.feed_type not null default 'announcement',
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id)
);

create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  full_name text not null,
  subject_ids text[] not null default '{}',
  available_slots text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text unique not null,
  room_name text not null,
  capacity int not null default 30,
  room_type text not null,
  available_slots text[] not null default '{}'
);

create table if not exists public.schedule_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subject_id text not null,
  class_group_id text not null,
  teacher_id uuid references public.teachers(id) on delete set null,
  duration int not null default 1,
  room_type text not null,
  preferred_slots text[] not null default '{}',
  forbidden_slots text[] not null default '{}',
  bundle_key text,
  fixed_slot text,
  allowed_substitute_teacher_ids uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.schedule_assignments (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references public.schedule_sessions(id) on delete cascade,
  title text not null,
  class_group_id text not null,
  teacher_name text not null,
  room_name text not null,
  slot_id text not null,
  label text,
  is_substitution boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  audience text[] not null default '{all}',
  title text not null,
  body text not null,
  read_by uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.subject_performance enable row level security;
alter table public.achievements enable row level security;
alter table public.feed_posts enable row level security;
alter table public.teachers enable row level security;
alter table public.rooms enable row level security;
alter table public.schedule_sessions enable row level security;
alter table public.schedule_assignments enable row level security;
alter table public.notifications enable row level security;

create policy "profiles self read"
on public.profiles for select
using (auth.uid() = auth_user_id);

create policy "students visible to everyone in demo"
on public.students for select using (true);

create policy "subject performance visible in demo"
on public.subject_performance for select using (true);

create policy "achievements visible in demo"
on public.achievements for select using (true);

create policy "feed visible in demo"
on public.feed_posts for select using (true);

create policy "teachers visible in demo"
on public.teachers for select using (true);

create policy "rooms visible in demo"
on public.rooms for select using (true);

create policy "sessions visible in demo"
on public.schedule_sessions for select using (true);

create policy "assignments visible in demo"
on public.schedule_assignments for select using (true);

create policy "notifications visible in demo"
on public.notifications for select using (true);

create policy "admins manage feed"
on public.feed_posts for all
using (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid() and p.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    where p.auth_user_id = auth.uid() and p.role = 'admin'
  )
);
