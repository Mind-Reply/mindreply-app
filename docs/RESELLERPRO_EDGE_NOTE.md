# ResellerPro edge note (A11)

**Decision context:** Owner asked to make ResellerPro usable **instead of Vercel** from now on.

**Action taken:** Added `docs/HOST_AGNOSTIC_EDGE.md` in `resellerpro-platform` so production can run on:

- Vercel (current)
- **Render** (recommended alternative)
- **Docker** (full control)

**Product truth unchanged:**

- ResellerPro = domain/reseller **control plane** (not a drop-in Vercel clone for arbitrary sites)
- Live domain mutations stay **off** until go-live sequence passes
- Data = Supabase · Payments = Stripe · Registrar = OpusDNS (+ Openprovider)

**Owner next step (optional):**  
Reply with `Use Render as primary edge for ResellerPro` (or Docker) and we execute the stand-up checklist without cutting over DNS until health is green.
