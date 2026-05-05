-- Глобальная агрегированная статистика для админки.
-- Все функции возвращают только агрегаты (без user_id), безопасны для публичного вызова.

-- Общая статистика
create or replace function get_global_stats()
returns table (
  total_users bigint,
  total_words bigint,
  total_reads bigint
)
language sql
security definer
as $$
  select
    (select count(*) from auth.users where email_confirmed_at is not null),
    (select count(*) from dictionary),
    (select count(*) from progress);
$$;

grant execute on function get_global_stats() to anon, authenticated;

-- Самые популярные тексты по количеству прочтений
create or replace function get_popular_texts(lim int default 20)
returns table (text_id text, reads bigint)
language sql
security definer
as $$
  select text_id, count(*) as reads
  from progress
  group by text_id
  order by reads desc, text_id
  limit lim;
$$;

grant execute on function get_popular_texts(int) to anon, authenticated;

-- Самые сохраняемые слова в словари
create or replace function get_top_words(lim int default 30)
returns table (word text, translation text, saves bigint)
language sql
security definer
as $$
  select
    text as word,
    (array_agg(translation order by created_at desc))[1] as translation,
    count(*) as saves
  from dictionary
  group by text
  order by saves desc, text
  limit lim;
$$;

grant execute on function get_top_words(int) to anon, authenticated;

-- Регистрации по дням за последние 30 дней
create or replace function get_signups_per_day()
returns table (day date, signups bigint)
language sql
security definer
as $$
  select
    date_trunc('day', created_at)::date as day,
    count(*) as signups
  from auth.users
  where created_at > now() - interval '30 days'
    and email_confirmed_at is not null
  group by 1
  order by 1;
$$;

grant execute on function get_signups_per_day() to anon, authenticated;
