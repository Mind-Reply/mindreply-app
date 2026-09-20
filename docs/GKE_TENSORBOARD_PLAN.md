# GKE + TensorBoard Plan (Real-Time Visual Diagnostics)

**Status:** SEALED — not running  
**Project:** `mind-reply-496111`  
**Region / zone:** `us-central1` / `us-central1-a`  
**Rule:** Nothing is created until you write a clear approval (and ideally a cost cap).

---

## Simple summary

This plan would give you:

- A small **Kubernetes cluster** (GKE) on Google Cloud  
- A **bucket** for training logs and visual assets  
- **TensorBoard** in the browser (charts, images, training progress)  
- Fast file access via **GCS Fuse** (good for image/video datasets)

It is a **solid technical design**. It is also **paid infrastructure**. Leave it on 24/7 and the bill adds up.

---

## What is already true about your project

| Check | Note |
|--------|------|
| GPU quota | **0** — so the plan correctly uses **N2 CPUs only** (no GPUs) |
| N2 CPU quota | **200** available — 2× `n2-standard-8` (16 vCPUs) is well inside |
| Reservations | None matching in `us-central1-a` right now |
| Org policy | All allowed (no block on region) |

---

## Rough cost if left on all month

| Piece | Order of magnitude |
|--------|---------------------|
| 2× n2-standard-8 nodes 24/7 | ~$180–200 / month |
| GKE management fee | ~$73 / month |
| Load balancer | ~$18 / month |
| Storage (logs) | low (a few $) |
| **Total if always on** | **roughly $270–300 / month** |

**Cheaper ways to run it:**

- Scale nodes to **0** when you are not training  
- Use **Spot** nodes for training jobs  
- Create the cluster only for a few days, then delete it  

---

## What is good in this blueprint

1. **Workload Identity** (no long-lived JSON keys) — correct and safer  
2. **GCS Fuse CSI** for image/video streaming — right tool for the job  
3. **TensorBoard `--reload_interval=5`** — keeps the UI fresh  
4. **N2-only design** — matches your GPU quota of 0  
5. **Guaranteed QoS** (CPU request = limit) — stable for diagnostics  

---

## What to be careful about

1. **Spend** — easy to forget the cluster is on  
2. **Public LoadBalancer on port 80** — TensorBoard would be on the open internet unless you add auth / IAP / IP allowlist  
3. **`roles/storage.objectAdmin` on the whole project** — tighter is better (bucket-only if possible)  
4. **Reservation create** — optional; not required to start; can fail if capacity is tight  
5. **Sample training job** in the YAML is a stub** — it does not train a real model yet; it only proves the path  

---

## How this connects to your A11 Monitor

- Monitor page = **your simple status board** (sites, offers, next steps)  
- TensorBoard = **optional deep ML diagnostics UI** (charts, images, training)  
- They are **not the same thing**  
- Monitor stays free and in the monorepo  
- TensorBoard only appears after you approve GKE and a public (or locked) URL exists  

---

## Best way to make it work (recommended path)

### Phase A — no extra cloud spend (do this first)
1. Redeploy **a11-k-core** so `a11-k.space/monitor` is live  
2. Keep using this Monitor + GitHub as your source of truth  
3. Use real screenshots / short real videos on your public sites when you have them  

### Phase B — only if you need ML training diagnostics
1. You write: `OK apply GKE TensorBoard for mind-reply-496111, max $XX`  
2. Enable APIs  
3. Create bucket + SA + cluster (2 nodes, scale-to-zero or Spot preferred)  
4. Apply manifests  
5. Put **IAP or basic auth** in front of TensorBoard before sharing the URL  
6. When done: scale to 0 or delete the cluster  

### Phase C — later (optional)
- Cloud Build / GitHub Actions to start jobs  
- Spot pool  
- Stronger bucket-only IAM  

---

## Approval line (copy if you want to proceed)

```
OK apply GKE TensorBoard plan for mind-reply-496111
max spend for this experiment: $____
prefer: scale-to-zero when idle / Spot if available
add auth in front of TensorBoard before public URL
```

Until that message exists, **no cluster is created** and **no bill starts from this plan**.
