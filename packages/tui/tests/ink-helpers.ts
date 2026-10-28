// Why: shared helpers for driving the terminal app in tests.
export async function frameWith(read: () => string | undefined, text: string) {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    const frame = read() ?? "";
    if (frame.includes(text)) return frame;
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
  throw new Error(`"${text}" never rendered:\n${read() ?? ""}`);
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 100));

/** Ink registers input handlers in effects, so let each render settle first. */
export async function press(
  stdin: { write: (data: string) => void },
  key: string,
) {
  await settle();
  stdin.write(key);
  await settle();
}
