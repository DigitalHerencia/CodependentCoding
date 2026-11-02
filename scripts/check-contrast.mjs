import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const stylesheet = process.argv[2]
  ? resolve(process.argv[2])
  : fileURLToPath(new URL("../app/globals.css", import.meta.url));
const css = readFileSync(stylesheet, "utf8");
const tokens = new Map(
  [...css.matchAll(/(--[\w-]+)\s*:\s*(#[\da-f]{6})\s*;/gi)].map(
    ([, name, value]) => [name, value],
  ),
);
const pairs = css.match(/\/\*\s*@pairs\s*\n([\s\S]*?)\*\//)?.[1];
if (!pairs?.trim()) throw new Error("Missing or empty /* @pairs */ block");

function luminance(token) {
  const hex = tokens.get(token);
  if (!hex) throw new Error(`Missing six-digit hex color for ${token}`);
  const channels = hex.match(/[\da-f]{2}/gi).map((channel) => {
    const value = parseInt(channel, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

let failures = 0;
let checked = 0;
for (const line of pairs.trim().split(/\r?\n/)) {
  const pair = line.trim().match(/^(text|ui)\s+(--[\w-]+)\s+(--[\w-]+)$/);
  if (!pair) throw new Error(`Invalid contrast pair: ${line.trim()}`);
  const [, kind, foreground, background] = pair;
  const light = luminance(foreground);
  const dark = luminance(background);
  const ratio = (Math.max(light, dark) + 0.05) / (Math.min(light, dark) + 0.05);
  const minimum = kind === "text" ? 4.5 : 3;
  if (ratio < minimum) {
    console.error(
      `${foreground} on ${background}: ${ratio.toFixed(2)}:1 < ${minimum}:1 (${kind})`,
    );
    failures++;
  }
  checked++;
}
if (failures) process.exitCode = 1;
else console.log(`Contrast: ${checked} declared pairs pass.`);
