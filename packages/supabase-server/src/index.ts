import { createSupabaseContext } from '@supabase/server'

export type A11SupabaseHealth = {
  ok: true
  service: 'a11-supabase-gateway'
  authenticated: boolean
  timestamp: string
}

/**
 * Public liveness response. This does not query the database and does not
 * disclose project configuration or credentials.
 */
export function publicHealth(): Response {
  return Response.json({
    ok: true,
    service: 'a11-supabase-gateway',
    timestamp: new Date().toISOString(),
  })
}

/**
 * Verifies a Supabase user JWT and assembles an RLS-scoped client.
 * The admin client on the returned context bypasses RLS and must only be used
 * inside narrowly reviewed server-side operations.
 */
export async function authenticatedHealth(request: Request): Promise<Response> {
  const { data: context, error } = await createSupabaseContext(request, {
    auth: 'user',
  })

  if (error) {
    return Response.json(
      { ok: false, code: 'AUTH_REQUIRED', message: error.message },
      { status: error.status },
    )
  }

  const body: A11SupabaseHealth = {
    ok: true,
    service: 'a11-supabase-gateway',
    authenticated: Boolean(context.userClaims),
    timestamp: new Date().toISOString(),
  }

  return Response.json(body)
}

/**
 * Example RLS-scoped query helper. Callers must pass a verified context client,
 * never the admin client, for user-facing reads.
 */
export async function readOwnedRows(
  request: Request,
  table: string,
): Promise<Response> {
  const { data: context, error } = await createSupabaseContext(request, {
    auth: 'user',
  })

  if (error) {
    return Response.json(
      { ok: false, code: 'AUTH_REQUIRED', message: error.message },
      { status: error.status },
    )
  }

  const { data, error: queryError } = await context.supabase
    .from(table)
    .select()

  if (queryError) {
    return Response.json(
      { ok: false, code: 'QUERY_FAILED', message: queryError.message },
      { status: 500 },
    )
  }

  return Response.json({ ok: true, data })
}
