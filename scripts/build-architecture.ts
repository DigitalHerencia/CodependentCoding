import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { workspaceAdapter } from "@/lib/content/architecture-adapters";
import { analyzeSource } from "@/lib/content/architecture-analysis";

// Host configuration only. New repositories provide an adapter; the engine has
// no knowledge of either of these examples or their directory conventions.
const projects = [
  {
    id: "website",
    label: "Codependent Coding · website",
    root: ".",
    roots: ["app/", "components/", "features/", "lib/", "content/", "types/"],
  },
  {
    id: "maximal",
    label: "Maximal Template · example",
    root: "packages/maximal-template",
    roots: [
      "app/",
      "components/",
      "features/",
      "lib/",
      "content/",
      "types/",
      "schemas/",
      "prisma/",
    ],
  },
];
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  encoding: "utf8",
}).trim();
const catalog = [];
for (const project of projects) {
  const root = path.resolve(project.root);
  const tracked = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "."],
    { cwd: root, encoding: "utf8", maxBuffer: 10_000_000 },
  ).split("\0");
  const deleted = new Set(
    execFileSync("git", ["ls-files", "--deleted", "-z"], {
      cwd: root,
      encoding: "utf8",
    }).split("\0"),
  );
  const files = [...new Set(tracked)].filter(
    (file) =>
      !deleted.has(file) &&
      project.roots.some((prefix) => file.startsWith(prefix)) &&
      /\.(?:[cm]?[jt]sx?|json|css|md|sql|prisma)$/.test(file) &&
      !/(?:^|\/)(?:node_modules|generated|\.next|dist|coverage|private|secrets?)(?:\/|\.)/i.test(
        file,
      ),
  );
  const config = JSON.parse(
    await readFile(path.join(root, "tsconfig.json"), "utf8"),
  );
  const metadata = {
    id: project.id,
    label: project.label,
    revision,
    sourceUrl: `https://github.com/DigitalHerencia/CodependentCoding/blob/${revision}/${project.root === "." ? "" : project.root + "/"}`,
  };
  const adapter = workspaceAdapter({
    root,
    files,
    metadata,
    aliases: config.compilerOptions?.paths ?? {},
  });
  const snapshot = await analyzeSource(adapter);
  const destination = path.join(".architecture", project.id);
  await mkdir(destination, { recursive: true });
  const index: Record<string, string> = {};
  const hash = createHash("sha256");
  for (const file of files) {
    const source = await adapter.read(file);
    hash.update(file).update(source);
    const key = createHash("sha256").update(file).digest("hex");
    index[file] = key;
    await writeFile(
      path.join(destination, key + ".json"),
      JSON.stringify(source),
    );
  }
  // Snapshot identity includes working-tree content, not just its base commit.
  const fingerprint = hash.digest("hex").slice(0, 16);
  snapshot.metadata.revision = `${revision.slice(0, 12)}:${fingerprint}`;
  await writeFile(
    path.join(destination, "snapshot.json"),
    JSON.stringify({ ...snapshot, index }),
  );
  catalog.push(snapshot.metadata);
  console.log(
    `${project.id}: ${files.length} files, ${snapshot.facts.length} analyzed modules; server-only snapshot ${fingerprint}`,
  );
}
await writeFile(".architecture/catalog.json", JSON.stringify(catalog));
