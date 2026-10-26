import { setTimeout as sleep } from "node:timers/promises";

import gradient from "gradient-string";

const ART = String.raw`
 _   _ ___ ____  ____ _____ _____ ____    ____ _____  _    ____ _  __
| | | |_ _|  _ \/ ___|_   _| ____|  _ \  / ___|_   _|/ \  / ___| |/ /
| |_| || || |_) \___ \ | | |  _| | |_) | \___ \ | | / _ \| |   | ' /
|  _  || ||  __/ ___) || | | |___|  _ <   ___) || |/ ___ \ |___| . \
|_| |_|___|_|   |____/ |_| |_____|_| \_\ |____/ |_/_/   \_\____|_|\_\
`.slice(1);

/** Synthwave palette: the sweep rotates through it, then settles. */
const PALETTE = ["#ff2a6d", "#ff8c42", "#f9f871", "#05d9e8", "#7b2ff7"];

/** The palette rotated `step` places: one frame of the sweep. */
export function paletteAt(step: number): string[] {
  const shift = step % PALETTE.length;
  return [...PALETTE.slice(shift), ...PALETTE.slice(0, shift)];
}

export function bannerFrame(step: number): string {
  return gradient(paletteAt(step)).multiline(ART);
}

export function animates(stream: NodeJS.WriteStream): boolean {
  return (
    stream.isTTY === true &&
    !process.env.CI &&
    !process.env.NO_COLOR &&
    process.env.TERM !== "dumb"
  );
}

/**
 * Prints the retro banner. On a color terminal it sweeps the gradient across
 * the art for about a second; elsewhere it prints the art once, plain.
 */
export async function showBanner(
  tagline: string,
  stream: NodeJS.WriteStream = process.stdout,
): Promise<void> {
  if (!animates(stream)) {
    stream.write(`${ART}  ${tagline}\n\n`);
    return;
  }
  const height = ART.split("\n").length - 1;
  const frames = PALETTE.length * 3;
  stream.write("\u001b[?25l");
  try {
    for (let step = 0; step < frames; step += 1) {
      if (step > 0) stream.write(`\u001b[${height}A`);
      stream.write(bannerFrame(step));
      await sleep(60);
    }
  } finally {
    stream.write("\u001b[?25h");
  }
  stream.write(`  ${gradient(PALETTE)(tagline)}\n\n`);
}
