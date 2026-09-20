# MindReply Local — iOS/Core ML foundation

This package establishes the first enforceable boundary for a privacy-first,
on-device MindReply client.

## Guarantees in this slice

- Core ML model execution is local.
- No networking dependency is present.
- No analytics or telemetry SDK is present.
- Remote inference and telemetry default to `false` and are covered by a test.
- Callers provide a compiled `.mlmodelc` URL; model conversion is outside the
  runtime package and must happen in a reproducible build pipeline.

## Next controlled steps

1. Select a small, licensed model and record its provenance.
2. Convert it with a pinned `coremltools` environment.
3. Benchmark latency, peak memory, thermal pressure, battery use, and output
   quality on owned test devices.
4. Add encrypted local storage and Secure Enclave-backed signing only after a
   threat model and key-recovery policy are approved.
5. Add App Privacy declarations before any external beta.

## Release gate

Do not claim “zero telemetry” or “offline” until network instrumentation on a
physical device confirms no outbound traffic during launch, inference, storage,
and failure paths.
