-- 2026-10: 冷蔵庫のテーブルは共通プロジェクト（cleaning-log / mqapkwlxlunyvsuhiujb）へ統合済み。
-- 共通側では RLS を有効にし、anon / authenticated に読み書きを許可している。
-- 以下は旧・専用プロジェクトでの初期設定（参考）。

-- ① 消費期限・品目名テーブル
create table if not exists fridge_items (
  id bigint generated always as identity primary key,
  room_no text not null,
  slot_idx integer not null,
  name text not null default '',
  expiry_date text not null default '',
  updated_at timestamptz default now(),
  unique(room_no, slot_idx)
);

-- ② 取り出し中テーブル
create table if not exists fridge_removed (
  id bigint generated always as identity primary key,
  key text not null unique,
  created_at timestamptz default now()
);

-- RLS無効（社内ツールなので不要）
alter table fridge_items disable row level security;
alter table fridge_removed disable row level security;
