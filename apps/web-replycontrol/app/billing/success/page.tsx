export default async function BillingSuccessPage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }> | { session_id?: string };
}) {
  const params = await Promise.resolve(searchParams ?? {});

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: 32 }}>
      <h1>Payment successful</h1>
      <p>Your checkout was started successfully.</p>
      <p>
        Session ID: <strong>{params.session_id ?? "not provided"}</strong>
      </p>
      <p>
        In production, this page is informational only. The system must verify the Stripe webhook before granting access or marking the work as paid.
      </p>
    </main>
  );
}
