#!/usr/bin/env node
import { resolve4, resolve6 } from "node:dns/promises";

const endpoints = [
  "https://mindreply.com/api/health",
  "https://a11-k.space/health",
];

let failed = false;

for (const endpoint of endpoints) {
  const url = new URL(endpoint);
  const addresses = [];

  for (const resolver of [resolve4, resolve6]) {
    try {
      addresses.push(...(await resolver(url.hostname)));
    } catch {
      // A hostname may intentionally publish only A or only AAAA records.
    }
  }

  if (addresses.length === 0) {
    console.error(`${url.hostname}: DNS_UNRESOLVED`);
    failed = true;
    continue;
  }

  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      headers: { "user-agent": "MindReply-Release-Check/1.0" },
    });
    const body = await response.text();
    console.log(`${endpoint}: HTTP ${response.status} ${body.slice(0, 300)}`);
    if (!response.ok) failed = true;
  } catch (error) {
    console.error(`${endpoint}: REQUEST_FAILED ${error.message}`);
    failed = true;
  }
}

process.exitCode = failed ? 1 : 0;
