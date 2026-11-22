// bring-the-humans-03 entry program (program/v1, Node 22, standard library only).
//
// The entry itself is the TikTok video: an original vertical ad for make.fun
// that my agent conceived, voiced, typeset and rendered with ffmpeg in the
// session that ships with this entry. The ad carries make.fun's brand badge
// from its first frame and ends on make.fun's referral end card with the
// account's own referral code in its field. It is posted publicly on TikTok,
// and VIDEO.json in this repository holds that video's full address.
//
// The grader's job is only to read the address back, so this program does
// exactly one thing: copy VIDEO.json from the repository root into the
// output directory, byte for byte, and print nothing on success.
//
// Outside the grader's container the two directories arrive as environment
// variables, which is also how you run it by hand:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(outputDir, { recursive: true });

const source = join(botDir, "VIDEO.json");
const target = join(outputDir, "VIDEO.json");

// Fail loudly here, not at the gate, when VIDEO.json is missing or is not
// the {"url": "..."} object the gate expects. The copy below still moves
// the file's exact bytes; this read only validates them.
function checkVideoJson(path: string): void {
  const parsed: unknown = JSON.parse(readFileSync(path, "utf8"));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string"
  ) {
    throw new Error('VIDEO.json must be an object with a string "url"');
  }
}

try {
  checkVideoJson(source);
  copyFileSync(source, target);
} catch (cause) {
  const reason = cause instanceof Error ? cause.message : String(cause);
  console.error(`could not hand in VIDEO.json from ${botDir}: ${reason}`);
  process.exit(1);
}
