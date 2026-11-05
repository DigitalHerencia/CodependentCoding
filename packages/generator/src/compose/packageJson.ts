interface Manifest {
  modules: { id: string; packages?: string[] }[];
}

interface PackageJson {
  name?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  [key: string]: unknown;
}

/**
 * Drops dependencies declared in `packages` by removed modules and by no kept
 * module, and renames the package. Key order is preserved.
 */
export function prunePackageJson(
  pkg: PackageJson,
  manifest: Manifest,
  kept: readonly string[],
  name: string,
): { pkg: PackageJson; removed: string[] } {
  const keptPackages = new Set(
    manifest.modules
      .filter(({ id }) => kept.includes(id))
      .flatMap(({ packages = [] }) => packages),
  );
  const drop = new Set(
    manifest.modules
      .filter(({ id }) => !kept.includes(id))
      .flatMap(({ packages = [] }) => packages)
      .filter((dep) => !keptPackages.has(dep)),
  );
  const removed: string[] = [];
  const filter = (deps?: Record<string, string>) =>
    deps &&
    Object.fromEntries(
      Object.entries(deps).filter(([dep]) => {
        if (!drop.has(dep)) return true;
        removed.push(dep);
        return false;
      }),
    );
  const next: PackageJson = { ...pkg, name };
  if (pkg.dependencies) next.dependencies = filter(pkg.dependencies)!;
  if (pkg.devDependencies) next.devDependencies = filter(pkg.devDependencies)!;
  return { pkg: next, removed: removed.sort() };
}
