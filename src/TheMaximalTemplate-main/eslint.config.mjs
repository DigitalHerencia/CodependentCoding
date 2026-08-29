import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";
import reactRefresh from "eslint-plugin-react-refresh";

export default defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  { plugins: { "react-refresh": reactRefresh } },
  globalIgnores([".next/**", "generated/prisma/**"]),
]);
