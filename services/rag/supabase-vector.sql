-- MindReply semantic knowledge retrieval foundation.
-- Runtime status: schema/RPC contract only until an embedding producer is explicitly wired.
create extension if not exists vector;

create table if not exists public.sovereign_knowledge_embeddings (
  id uuid primary key default gen_random_uuid(),
  origin_source varchar(128) not null,
  document_title varchar(256) not null,
  chunk_content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists idx_sovereign_knowledge_hnsw
on public.sovereign_knowledge_embeddings
using hnsw (embedding vector_cosine_ops)
with (m = 16, ef_construction = 64);

alter table public.sovereign_knowledge_embeddings enable row level security;
drop policy if exists service_role_vector_access on public.sovereign_knowledge_embeddings;
create policy service_role_vector_access
on public.sovereign_knowledge_embeddings
for all to service_role using (true) with check (true);

create or replace function public.match_sovereign_knowledge(
  query_embedding vector(1536),
  match_threshold double precision,
  match_count integer
)
returns table(id uuid, origin_source varchar, document_title varchar, chunk_content text, metadata jsonb, similarity double precision)
language sql stable security invoker set search_path = public
as $$
  select ske.id, ske.origin_source, ske.document_title, ske.chunk_content, ske.metadata,
         1 - (ske.embedding <=> query_embedding) as similarity
  from public.sovereign_knowledge_embeddings ske
  where ske.embedding is not null
    and 1 - (ske.embedding <=> query_embedding) > match_threshold
  order by ske.embedding <=> query_embedding
  limit greatest(0, least(match_count, 100));
$$;
