-- Albums: one per user, sticker counts stored as JSONB
-- user_id is UNIQUE so upsert(onConflict: "user_id") works correctly
create table if not exists albums (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null unique references auth.users(id) on delete cascade,
  counts      jsonb       not null default '{}',
  share_slug  text        unique,
  updated_at  timestamptz not null default now()
);

create index if not exists albums_share_slug_idx on albums (share_slug) where share_slug is not null;

-- Auto-update updated_at on every write
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger albums_updated_at
  before update on albums
  for each row execute function update_updated_at();

-- Row Level Security
alter table albums enable row level security;

-- Users manage only their own album
create policy "own_album_all" on albums
  for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anyone can view a shared album (share_slug is set)
create policy "shared_album_read" on albums
  for select
  using (share_slug is not null);
