// Why: the screens the terminal app can show and the key that opens each.
export const screens = [
  { id: "home", label: "Home", key: "1" },
  { id: "doctrine", label: "Doctrine", key: "2" },
  { id: "modules", label: "Modules", key: "3" },
  { id: "checks", label: "Checks", key: "4" },
  { id: "slices", label: "Slice", key: "5" },
] as const;

export type ScreenId = (typeof screens)[number]["id"];
