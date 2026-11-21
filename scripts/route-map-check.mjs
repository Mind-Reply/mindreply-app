#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APPS = [
  { id: "main", appDir: "app", clientRoots: ["app", "components", "lib"] },
  { id: "replycontrol", appDir: "apps/web-replycontrol/app", clientRoots: ["apps/web-replycontrol/app", "apps/web-replycontrol/components", "apps/web-replycontrol/lib"] },
  { id: "phone-first-starter", appDir: "phone-first-saas-starter/src/app", clientRoots: ["phone-first-saas-starter/src/app", "phone-first-saas-starter/src/components", "phone-first-saas-starter/src/lib"] },
].filter((app) => fs.existsSync(path.join(ROOT, app.appDir)));
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const IGNORE = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git", "generated"]);
const results = [];

function walk(dir, visit) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && IGNORE.has(entry.name)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, visit);
    else visit(file);
  }
}
function norm(value) {
  return value.replace(/\\/g, "/").replace(/\/+/g, "/").replace(/\/$/, "") || "/";
}
function clean(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
}
function apiRoute(apiRoot, file) {
  const relative = path.relative(apiRoot, file).replace(/\\/g, "/");
  const parts = relative.split("/");
  parts.pop();
  const segments = parts.filter(Boolean).map((part) => {
    if (/^\[\[\.\.\..+\]\]$/.test(part)) return ":catchall?";
    if (/^\[\.\.\..+\]$/.test(part)) return ":catchall";
    if (/^\[.+\]$/.test(part)) return ":param";
    return part;
  });
  return norm("/api/" + segments.join("/"));
}
function routeMatches(defined, requested) {
  const a = defined.split("/").filter(Boolean);
  const b = requested.split("/").filter(Boolean);
  let i = 0;
  for (; i < a.length; i++) {
    const segment = a[i];
    if (segment === ":catchall?") return true;
    if (segment === ":catchall") return i < b.length;
    if (i >= b.length) return false;
    if (segment !== ":param" && segment !== b[i]) return false;
  }
  return i === b.length;
}
function methodOf(options, fallback) {
  const match = (options || "").match(/\bmethod\s*:\s*["'\x60]([A-Za-z]+)["'\x60]/);
  return match ? match[1].toUpperCase() : fallback;
}
function clientRoute(raw) {
  let value = raw.trim();
  if (!value.startsWith("/api/") && value !== "/api") return null;
  value = value.split(/[?#]/, 1)[0].replace(/\$\{[^}]+\}/g, ":param");
  return norm(value);
}
function relative(file) {
  return path.relative(ROOT, file).replace(/\\/g, "/");
}
function scanClientFile(file, frontend, warnings) {
  if (!EXTENSIONS.has(path.extname(file)) || file.includes(path.sep + "api" + path.sep)) return;
  const source = clean(fs.readFileSync(file, "utf8"));
  function record(raw, method, offset, kind) {
    const route = clientRoute(raw);
    if (route) frontend.push({ route, method, file: relative(file), line: source.slice(0, offset).split("\n").length, source: kind });
  }
  const fetchRe = /\bfetch\s*\(\s*(["'\x60])([^"'\x60]*?\/api(?:\/[^"'\x60]*)?)\1([\s\S]{0,500}?)\)/g;
  for (const match of source.matchAll(fetchRe)) record(match[2], methodOf(match[3], "GET"), match.index || 0, "fetch");
  const axiosVerb = /\baxios\s*\.\s*(get|post|put|patch|delete|head|options)\s*\(\s*(["'\x60])([^"'\x60]*?\/api(?:\/[^"'\x60]*)?)\2/g;
  for (const match of source.matchAll(axiosVerb)) record(match[3], match[1].toUpperCase(), match.index || 0, "axios");
  const axiosConfig = /\baxios(?:\.request)?\s*\(\s*\{([\s\S]{0,1200}?)\}\s*\)/g;
  for (const match of source.matchAll(axiosConfig)) {
    const url = match[1].match(/\burl\s*:\s*(["'\x60])([^"'\x60]*?\/api(?:\/[^"'\x60]*)?)\1/);
    if (url) record(url[2], methodOf(match[1], "GET"), match.index || 0, "axios-config");
  }
  const classified = new Set(frontend.filter((item) => item.file === relative(file)).map((item) => item.route));
  const literalRe = /(["'\x60])(\/api(?:\/[A-Za-z0-9_./:[\]$-]+)?)\1/g;
  for (const match of source.matchAll(literalRe)) {
    const route = clientRoute(match[2]);
    if (route && !classified.has(route)) warnings.push({
      type: "unclassified-api-reference", route, file: relative(file),
      line: source.slice(0, match.index || 0).split("\n").length,
      message: "API path literal found outside a recognized fetch/axios call; inspect the custom request wrapper."
    });
  }
  const dynamicCalls = [...source.matchAll(/\b(?:fetch|axios(?:\.request)?)\s*\(\s*(?!["'\x60{])/g)];
  for (const match of dynamicCalls) warnings.push({
    type: "dynamic-client-call", file: relative(file),
    line: source.slice(0, match.index || 0).split("\n").length,
    message: "Request URL may be computed indirectly and is outside static route verification."
  });
}
for (const app of APPS) {
  const backend = new Map();
  const frontend = [];
  const warnings = [];
  const missing = [];
  const appDir = path.join(ROOT, app.appDir);
  const apiRoot = path.join(appDir, "api");
  walk(apiRoot, (file) => {
    if (!/\/route\.[cm]?[jt]sx?$/.test(file.replace(/\\/g, "/"))) return;
    const source = clean(fs.readFileSync(file, "utf8"));
    const methods = METHODS.filter((method) => new RegExp("\\bexport\\s+(?:async\\s+)?function\\s+" + method + "\\b|\\bexport\\s+const\\s+" + method + "\\s*=", "m").test(source));
    if (!methods.length) return;
    const route = apiRoute(apiRoot, file);
    if (!backend.has(route)) backend.set(route, { route, methods: new Set(), files: [] });
    methods.forEach((method) => backend.get(route).methods.add(method));
    backend.get(route).files.push(relative(file));
  });
  for (const root of app.clientRoots) walk(path.join(ROOT, root), (file) => scanClientFile(file, frontend, warnings));
  for (const call of frontend) {
    const candidates = [...backend.values()].filter((item) => routeMatches(item.route, call.route));
    if (!candidates.length) missing.push({ ...call, problem: "NO_BACKEND_ROUTE" });
    else if (!candidates.some((item) => item.methods.has(call.method))) {
      missing.push({ ...call, problem: "METHOD_NOT_EXPORTED", available: [...new Set(candidates.flatMap((item) => [...item.methods]))] });
    }
  }
  const used = frontend.map((item) => item.route);
  const unreferenced = [...backend.values()].filter((item) => !used.some((route) => routeMatches(item.route, route)))
    .map((item) => ({ route: item.route, methods: [...item.methods].sort(), files: item.files }));
  results.push({
    app: app.id,
    appRoot: app.appDir,
    summary: { backendRoutes: backend.size, frontendCalls: frontend.length, missingContracts: missing.length, warnings: warnings.length, unreferencedBackendRoutes: unreferenced.length },
    backendRoutes: [...backend.values()].map((item) => ({ route: item.route, methods: [...item.methods].sort(), files: item.files })),
    frontendCalls: frontend,
    missingContracts: missing,
    warnings,
    unreferencedBackendRoutes: unreferenced
  });
}
const report = {
  generatedAt: new Date().toISOString(),
  summary: {
    applications: results.length,
    backendRoutes: results.reduce((sum, item) => sum + item.summary.backendRoutes, 0),
    frontendCalls: results.reduce((sum, item) => sum + item.summary.frontendCalls, 0),
    missingContracts: results.reduce((sum, item) => sum + item.summary.missingContracts, 0),
    warnings: results.reduce((sum, item) => sum + item.summary.warnings, 0),
  },
  applications: results
};
fs.writeFileSync(path.join(ROOT, "route-map-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.summary, null, 2));
for (const app of results) {
  for (const item of app.missingContracts) console.error("ERROR [" + app.app + "] " + item.problem + ": " + item.method + " " + item.route + " (" + item.file + ":" + item.line + ")");
  for (const item of app.warnings) console.warn("WARN [" + app.app + "] " + item.type + ": " + (item.route || "") + " (" + item.file + ":" + item.line + ") " + item.message);
}
if (report.summary.missingContracts) process.exitCode = 1;
