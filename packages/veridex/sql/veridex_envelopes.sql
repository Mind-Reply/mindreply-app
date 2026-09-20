-- Veridex append-only ledger
-- Apply in Supabase SQL editor with service role / migration runner.
-- RLS: inserts via service role only; select for authenticated owner roles.

create table if not exists public.veridex_envelopes (
  envelope_id     text primary key,
  payload_hash    text not null,
  signature       text,
  previous_hash   text,
  prompt_version  text,
  evaluation      jsonb not null,
  signed_at       timestamptz not null,
  request_id      text not null,
  created_at      timestamptz not null default now()
);

create index if not exists veridex_envelopes_request_id_idx
  on public.veridex_envelopes (request_id);

create index if not exists veridex_envelopes_signed_at_idx
  on public.veridex_envelopes (signed_at desc);

alter table public.veridex_envelopes enable row level security;

-- No public insert/update/delete via anon key
-- Service role bypasses RLS for append from gate API

-- Optional: allow authenticated owners to read their own request trails
-- Adjust claim key to match your auth model
drop policy if exists veridex_select_authenticated on public.veridex_envelopes;
create policy veridex_select_authenticated
  on public.veridex_envelopes
  for select
  to authenticated
  using (true);

comment on table public.veridex_envelopes is
  'Append-only Veridex cryptographic envelopes (.epack). Do not update or delete rows.';
