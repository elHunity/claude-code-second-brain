// Turns a raw Claude Code JSONL session transcript into readable markdown.
// The raw file stays next to it as the source of truth.
//
//   node render-session.mjs <in.jsonl> <out.md> [title]

import { readFileSync, writeFileSync } from "node:fs";

const [, , inPath, outPath, title = "Session"] = process.argv;
if (!inPath || !outPath) {
  console.error("Usage: render-session.mjs <in.jsonl> <out.md> [title]");
  process.exit(1);
}

const lines = readFileSync(inPath, "utf8").split("\n").filter(Boolean);

// Tool calls become one line: what was called and why. Their output is dropped:
// it is ~90% of the volume and explains almost nothing.
const toolLine = (name, input) => {
  const d = input?.description || input?.file_path || input?.pattern || input?.skill || "";
  const short = String(d).replace(/\s+/g, " ").slice(0, 110);
  return `*→ ${name}${short ? ": " + short : ""}*`;
};

// Environment inserts get glued to real user messages. Strip only the inserts,
// keep the message — dropping the whole message loses the user's words silently.
const stripEnvelope = (s) =>
  s
    .replace(/<local-command-caveat>[\s\S]*?<\/local-command-caveat>/g, "")
    .replace(/<local-command-stdout>[\s\S]*?<\/local-command-stdout>/g, "")
    .replace(/<command-(name|message|args)>[\s\S]*?<\/command-\1>/g, "")
    .replace(/<ide_(selection|opened_file)>[\s\S]*?<\/ide_\1>/g, "")
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const textOf = (content) => {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((b) => {
      if (b.type === "text") return b.text.trim();
      if (b.type === "tool_use") return toolLine(b.name, b.input);
      if (b.type === "thinking") return null; // thinking is not included
      return null;
    })
    .filter(Boolean)
    .join("\n\n");
};

const out = [];
let firstTs = null,
  lastTs = null,
  turns = 0,
  tools = 0;

for (const line of lines) {
  let e;
  try {
    e = JSON.parse(line);
  } catch {
    continue;
  }
  if (e.timestamp) {
    firstTs ??= e.timestamp;
    lastTs = e.timestamp;
  }
  if (e.type !== "user" && e.type !== "assistant") continue;

  const content = e.message?.content;
  // Tool results arrive as user messages; they are not the human speaking.
  if (
    e.type === "user" &&
    Array.isArray(content) &&
    content.every((b) => b.type === "tool_result")
  )
    continue;

  const body = e.type === "user" ? stripEnvelope(textOf(content)) : textOf(content);
  if (!body) continue;

  tools += (body.match(/^\*→ /gm) || []).length;

  out.push(`## ${e.type === "user" ? "User" : "Claude"}\n\n${body}\n`);
  turns++;
}

const head = [
  "---",
  "type: session",
  "status: done",
  "confidence: verbatim",
  "answers:",
  `  - "How did we get to what the log records for ${String(firstTs).slice(0, 10)}?"`,
  '  - "What exactly was said in this session?"',
  "tags: [session, raw]",
  `source: ${inPath.replace(/\\/g, "/")}`,
  `captured: ${new Date().toISOString().slice(0, 10)}`,
  `method: render of the raw Claude Code JSONL transcript (tool output omitted)`,
  "---",
  "",
  `# ${title}`,
  "",
  `> Verbatim dialogue. Start ${firstTs}, end ${lastTs}. Turns: ${turns}, tool calls: ${tools}.`,
  "> Tool output omitted: most of the volume, little of the meaning.",
  "> The raw source is next to this file as `.jsonl`.",
  "",
].join("\n");

writeFileSync(outPath, head + out.join("\n"), "utf8");
console.log(`turns: ${turns}, tool calls: ${tools}`);
console.log(`period: ${firstTs} -> ${lastTs}`);
