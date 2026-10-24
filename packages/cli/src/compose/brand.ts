/**
 * Brand color (Design.md §3.2): `--primary` becomes the chosen color and
 * `--primary-foreground` whichever palette source (foreground or background)
 * contrasts more with it. `--signal` follows `--primary` when the token exists.
 */
const HEX = /^#?([0-9a-f]{6})$/i;

export function parseHex(input: string): string | null {
  const match = HEX.exec(input.trim());
  return match ? `#${match[1]!.toLowerCase()}` : null;
}

type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))));
  };
  return [f(0), f(8), f(4)];
}

/** `#2f7a8d` → `192 50% 37%`, the triplet format globals.css uses. */
export function hexToHslTriplet(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255) as Rgb;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  let s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = 60 * (((g - b) / d) % 6);
    else if (max === g) h = 60 * ((b - r) / d + 2);
    else h = 60 * ((r - g) / d + 4);
  }
  if (h < 0) h += 360;
  return `${Math.round(h)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function tripletToRgb(triplet: string): Rgb | null {
  const match = /^(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/.exec(
    triplet.trim(),
  );
  if (!match) return null;
  return hslToRgb(
    Number(match[1]),
    Number(match[2]) / 100,
    Number(match[3]) / 100,
  );
}

function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (hi + 0.05) / (lo + 0.05);
}

const token = (name: string) =>
  new RegExp(`(^\\s*--${name}:\\s*)([^;]+)(;)`, "m");

export interface BrandResult {
  css: string;
  foreground: "foreground" | "background";
  ratio: number;
}

/** Rewrites the brand tokens in globals.css; throws if a palette source is missing. */
export function applyBrandColor(css: string, hex: string): BrandResult {
  const read = (name: string) => {
    const value = token(name).exec(css)?.[2];
    const rgb = value ? tripletToRgb(value) : null;
    if (!rgb) throw new Error(`globals.css has no HSL --${name} token`);
    return rgb;
  };
  const brand = hexToRgb(hex);
  const onForeground = contrast(brand, read("foreground"));
  const onBackground = contrast(brand, read("background"));
  const foreground = onForeground >= onBackground ? "foreground" : "background";
  if (!token("primary").test(css))
    throw new Error("globals.css has no --primary token");

  let next = css.replace(token("primary"), `$1${hexToHslTriplet(hex)}$3`);
  next = token("primary-foreground").test(next)
    ? next.replace(token("primary-foreground"), `$1var(--${foreground})$3`)
    : next;
  if (token("signal").test(next)) {
    next = next.replace(token("signal"), "$1var(--primary)$3");
  }
  return {
    css: next,
    foreground,
    ratio: Math.max(onForeground, onBackground),
  };
}
