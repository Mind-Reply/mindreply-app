#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_ROOTS = ["app", "apps/web-replycontrol/app"].filter((p) => fs.existsSync(path.join(ROOT, p)));
const CLIENT_ROOTS = ["app", "components", "lib", "apps/web-replycontrol/app", "apps/web-replycontrol/components", "apps/web-replycontrol/lib"].filter((p) => fs.existsSync(path.join(ROOT, p)));
const EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
const IGNORE = new Set(["node_modules", ".next", "dist", "build", "coverage", ".git", "generated"]);
const backend = new Map();
const frontend = [];
const warnings = [];
const missing = [];

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
    if (/^\[\[\.{3}.+\]\]$/.test(part) || /^\[\.{3}.+\]$/.test(part)) return "*";
    if (/^\[.+\]$/.test(part)) return ":param";
    return part;
  });
  return norm("/api/" + segments.join("/"));
}
function addBackend(route, methods, file) {
  route = norm(route);
  if (!backend.has(route)) backend.set(route, { route, methods: new Set(), files: [] });
  const item = backend.get(route);
  methods.forEach((method) => item.methods.add(method));
  item.files.push(path.relative(ROOT, file).replace(/\\/g, "/"));
}
for (const appRoot of APP_ROOTS) {
  const apiRoot = path.join(ROOT, appRoot, "api");
  walk(apiRoot, (file) => {
    if (!/\/route\.[cm]?[jt]sx?$/.test(file.replace(/\\/g, "/"))) return;
    const source = clean(fs.readFileSync(file, "utf8"));
    const found = METHODS.filter((method) => new RegExp("\\bexport\\s+(?:async\\s+)?function\\s+" + method + "\\b|\\bexport\\s+const\\s+" + method + "\\s*=", "m").test(source));
    if (found.length) addBackend(apiRoute(apiRoot, file), found, file);
  });
}
function methodOf(options, fallback) {
  const match = (options || "").match(/\bmethod\s*:\s*["'\x60]([A-Za-z]+)["'\x60]/);
  return match ? match[1].toUpperCase() : fallback;
}
function clientRoute(raw) {
  let value = raw.trim();
  if (!value.startsWith("/api/") && value !== "/api") return null;
  value = value.split(/[?#]/, 1)[0];
  value = value.replace(/\$\{[^}]+\}/g, ":param");
  return norm(value);
}
function record(file, raw, method, line, kind) {
  const route = clientRoute(raw);
  if (route) frontend.push({ route, method, file: path.relative(ROOT, file).replace(/\\/g, "/"), line, source: kind });
}
function scan(file) {
  if (!EXTENSIONS.has(path.extname(file)) || file.includes(path.sep + "api" + path.sep)) return;
  const source = clean(fs.readFileSync(file, "utf8"));
  const fetchRe = /\bfetch\s*\(\s*(["'\x60])([^"'\x60]*?\/api\/[^"'\x60]*?)\1([\s\S]{0,500}?)\)/g;
  for (const match of source.matchAll(fetchRe)) {
    const line = source.slice(0, match.index || 0).split("\n").length;
    record(file, match[2], methodOf(match[3], "GET"), line, "fetch");
  }
  const axiosVerb = /\baxios\s*\.\s*(get|post|put|patch|delete|head|options)\s*\(\s*(["'\x60])([^"'\x60]*?\/api\/[^"'\x60]*?)\2/g;
  for (const match of source.matchAll(axiosVerb)) {
    const line = source.slice(0, match.index || 0).split("\n").length;
    record(file, match[3], match[1].toUpperCase(), line, "axios");
  }
  const axiosConfig = /\baxios(?:\.request)?\s*\(\s*\{([\s\S]{0,1200}?)\}\s*\)/g;
  for (const match of source.matchAll(axiosConfig)) {
    const url = match[1].match(/\burl\s*:\s*(["'\x60])([^"'\x60]*?\/api\/[^"'\x60]*?)\1/);
    if (url) {
      const line = source.slice(0, match.index || 0).split("\n").length;
      record(file, url[2], methodOf(match[1], "GET"), line, "axios-config");
    }
  }
  const literalRe = /(["'\x60])(\/api\/[A-Za-z0-9_./:[\]$-]+)\1/g;
  const ownCalls = new Set(frontend.filter((item) => item.file === path.relative(ROOT, file)).map((item) => item.line + ":" + item.route));
  for (const match of source.matchAll(literalRe)) {
    const line = source.slice(0, match.index || 0).split("\n").length;
    const route = clientRoute(match[2]);
    if (route && !ownCalls.has(line + ":" + route)) warnings.push({
      type: "unclassified-api-reference", route, file: path.relative(ROOT, file).replace(/\\/g, "/"), line,
      message: "API path literal found outside a recognized fetch/axios call; inspect custom request wrapper."
    });
  }
  if (/\bfetch\s*\(\s*(?!["'\x60])/.test(source) || /\baxios(?:\.request)?\s*\(\s*(?!["'{])/.test(source)) {
    const line = Math.max(source.split(/\r?\n/).findIndex((value) => /\b(fetch|axios)\s*\(/.test(value)) + 1, 1);
    warnings.push({ type: "dynamic-client-call", file: path.relative(ROOT, file).replace(/\\/g, "/"), line,
      message: "A request URL may be computed indirectly and is outside static route verification." });
  }
}
for (const root of CLIENT_ROOTS) walk(path.join(ROOT, root), scan);

function matches(defined, requested) {
  const a = defined.split("/").filter(Boolean);
  const b = requested.split("/").filter(Boolean);
  return a.length === b.length && a.every((segment, i) => segment === ":param" || segment === "*" || b[i] === ":param" || segment === b[i]);
}
for (const call of frontend) {
  const candidates = [...backend.values()].filter((item) => matches(item.route, call.route));
  if (!candidates.length) missing.push({ ...call, problem: "NO_BACKEND_ROUTE" });
  else if (!candidates.some((item) => item.methods.has(call.method))) {
    missing.push({ ...call, problem: "METHOD_NOT_EXPORTED", available: [...new Set(candidates.flatMap((item) => [...item.methods]))] });
  }
}
const used = frontend.map((item) => item.route);
const unreferenced = [...backend.values()].filter((item) => !used.some((route) => matches(item.route, route)))
  .map((item) => ({ route: item.route, methods: [...item.methods], files: item.files }));
const report = {
  generatedAt: new Date().toISOString(),
  scope: { appRoots: APP_ROOTS, clientRoots: CLIENT_ROOTS },
  summary: { backendRoutes: backend.size, frontendCalls: frontend.length, missingContracts: missing.length, warnings: warnings.length, unreferencedBackendRoutes: unreferenced.length },
  backendRoutes: [...backend.values()].map((item) => ({ route: item.route, methods: [...item.methods].sort(), files: item.files })),
  frontendCalls: frontend, missingContracts: missing, warnings, unreferencedBackendRoutes: unreferenced
};
fs.writeFileSync(path.join(ROOT, "route-map-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report.summary, null, 2));
for (const item of missing) console.error("ERROR " + item.problem + ": " + item.method + " " + item.route + " (" + item.file + ":" + item.line + ")");
for (const item of warnings) console.warn("WARN " + item.type + ": " + (item.route || "") + " (" + item.file + ":" + item.line + ") " + item.message);
if (missing.length) process.exitCode = 1;
