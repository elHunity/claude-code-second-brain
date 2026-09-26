#!/usr/bin/env node
// Mechanical vault checks: empty files, broken [[links]], orphans, incomplete frontmatter,
// notes missing from 00-Index.md. Prints "attention" items separately: reconstruction,
// outdated, unsorted inbox. Exit code 1 if there are errors.
//
//   node scripts/lint.mjs [vault dir]

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, basename, extname } from "node:path";

const root = process.argv[2] || process.cwd();
const SKIP = new Set([".git", ".obsidian", ".claude", "Archive", "node_modules", "scripts"]);
const REQUIRED = ["type", "status", "confidence", "answers", "captured", "updated", "method"];
const STRICT_DIRS = ["Sources", "Topics"];

const files = [];
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) walk(p);
    else if (extname(name) === ".md") files.push(p);
  }
})(root);

const byName = new Map(files.map((f) => [basename(f, ".md"), f]));
const inbound = new Map(files.map((f) => [f, 0]));
const errors = [];
const attention = [];

const frontmatter = (text) => {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return null;
  const fm = {};
  for (const line of m[1].split("\n")) {
    const k = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (k) fm[k[1]] = k[2].trim();
  }
  return fm;
};

for (const f of files) {
  const rel = relative(root, f);
  const text = readFileSync(f, "utf8");
  if (!text.trim() && !rel.startsWith("Inbox")) errors.push(`empty file: ${rel}`);

  // Links, with code spans and fenced blocks removed.
  const body = text.replace(/```[\s\S]*?```/g, "").replace(/`[^`\n]*`/g, "");
  for (const m of body.matchAll(/\[\[([^\]|#]+)(?:[#|][^\]]*)?\]\]/g)) {
    const target = m[1].trim();
    if (byName.has(target)) inbound.set(byName.get(target), inbound.get(byName.get(target)) + 1);
    else errors.push(`broken link in ${rel}: [[${target}]]`);
  }

  const fm = frontmatter(text);
  if (STRICT_DIRS.some((d) => rel.startsWith(d + "/"))) {
    if (!fm) errors.push(`no frontmatter: ${rel}`);
    else {
      const missing = REQUIRED.filter((k) => !(k in fm));
      if (missing.length) errors.push(`frontmatter missing ${missing.join(", ")}: ${rel}`);
    }
  }
  if (fm?.confidence === "reconstruction") attention.push(`reconstruction (not checked against source): ${rel}`);
  if (fm?.status === "outdated") attention.push(`outdated: ${rel}`);
  if (rel.startsWith("Inbox/")) attention.push(`unsorted inbox: ${rel}`);
}

const indexPath = join(root, "00-Index.md");
const index = byName.has("00-Index") ? readFileSync(indexPath, "utf8") : "";
for (const f of files) {
  const rel = relative(root, f);
  const name = basename(f, ".md");
  if (!STRICT_DIRS.some((d) => rel.startsWith(d + "/"))) continue;
  if (!index.includes(`[[${name}]]`)) errors.push(`not in 00-Index.md: ${rel}`);
  if (inbound.get(f) === 0) errors.push(`orphan (no links in): ${rel}`);
}

console.log(`checked ${files.length} notes in ${root}`);
console.log(errors.length ? `\nERRORS (${errors.length})` : "\nno errors");
errors.forEach((e) => console.log("  " + e));
if (attention.length) {
  console.log(`\nATTENTION (${attention.length}) — not errors, but look`);
  attention.forEach((a) => console.log("  " + a));
}
process.exit(errors.length ? 1 : 0);
