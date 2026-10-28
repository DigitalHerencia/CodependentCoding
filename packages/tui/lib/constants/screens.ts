// Why: the screens the terminal app can show and the key that opens each.
export const screens = [
  { id: "home", label: "Home", key: "1" },
  { id: "doctrine", label: "Doctrine", key: "2" },
] as const;

export type ScreenId = (typeof screens)[number]["id"];
