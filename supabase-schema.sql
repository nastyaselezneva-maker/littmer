-- Таблица для словаря пользователя
create table if not exists dictionary (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  text text not null,
  translation text not null,
  transcription text,
  pos text,
  dict text,
  created_at timestamptz default now(),
  unique(user_id, text)
);

-- Индекс для быстрого поиска по пользователю
create index if not exists dictionary_user_idx on dictionary(user_id);

-- Таблица для прочитанных текстов
create table if not exists progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  text_id text not null,
  read_at timestamptz default now(),
  unique(user_id, text_id)
);

create index if not exists progress_user_idx on progress(user_id);

-- Row Level Security: каждый пользователь видит только свои данные
alter table dictionary enable row level security;
alter table progress enable row level security;

-- Политики для dictionary
create policy "Users can read own dictionary"
  on dictionary for select using (auth.uid() = user_id);
create policy "Users can insert own dictionary"
  on dictionary for insert with check (auth.uid() = user_id);
create policy "Users can update own dictionary"
  on dictionary for update using (auth.uid() = user_id);
create policy "Users can delete own dictionary"
  on dictionary for delete using (auth.uid() = user_id);

-- Политики для progress
create policy "Users can read own progress"
  on progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress"
  on progress for insert with check (auth.uid() = user_id);
create policy "Users can delete own progress"
  on progress for delete using (auth.uid() = user_id);
