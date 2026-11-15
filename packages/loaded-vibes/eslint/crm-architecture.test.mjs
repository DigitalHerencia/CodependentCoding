import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

import {
  filenameConventions,
  layers,
  useClientAllowed,
} from "./doctrine-map.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../maximal-template",
);
const crmDir = path.join(root, "features/crm");
const read = (relative) => readFileSync(path.join(root, relative), "utf8");
const featureFiles = () =>
  readdirSync(crmDir).filter((file) => file.endsWith(".tsx"));

test("CRM features, forms, client islands and skeletons use domain naming", () => {
  const allowed =
    /^(?:crm[A-Z][a-zA-Z0-9]*(?:FeatureClient|Feature|Form|Skeleton)|crmSkeletons)\.tsx$/;
  for (const filename of featureFiles()) {
    assert.match(filename, allowed, filename);
    const relative = "features/crm/" + filename;
    const layer = layers.find((entry) => entry.match.test(relative))?.id;
    if (filename.endsWith("FeatureClient.tsx"))
      assert.equal(layer, "feature-client", relative);
    if (filename.endsWith("Form.tsx"))
      assert.equal(layer, "feature-form", relative);
    if (filename.endsWith("Skeleton.tsx") || filename === "crmSkeletons.tsx")
      assert.equal(layer, "feature-skeleton", relative);
    if (/FeatureClient|Form/.test(filename))
      assert.equal(useClientAllowed.test(relative), true, relative);
    const convention = filenameConventions.find((entry) =>
      entry.dir.test("features/crm/"),
    );
    assert.ok(convention?.file.test(filename), relative);
  }
});

test("CRM presentation has only CRM-owned blocks and no schema imports", () => {
  const blocks = read("components/blocks/crm-blocks.tsx");
  const templates = read("components/templates/crm-templates.tsx");
  assert.doesNotMatch(
    blocks,
    /@\/components\/blocks\/shared|@\/schemas\/|from ["']react-hook-form["']/,
  );
  assert.doesNotMatch(blocks, /<div(?:\s|>)/);
  assert.doesNotMatch(
    templates,
    /@\/components\/blocks\/shared|@\/components\/templates\/shared|@\/components\/ui\/|@\/content\//,
  );
  assert.match(templates, /@\/components\/blocks\/crm-blocks/);
});

test("CRM content is only imported by CRM blocks", () => {
  const files = [
    "components/templates/crm-templates.tsx",
    ...featureFiles().map((file) => "features/crm/" + file),
  ];
  for (const file of files)
    assert.doesNotMatch(read(file), /@\/content\//, file);
});

test("CRM has one workflow module and no shared skeleton templates", () => {
  const workflows = readdirSync(path.join(root, "lib/workflows")).filter(
    (file) => /^crm.*Workflows\.ts$/.test(file),
  );
  assert.deepEqual(workflows, ["crmWorkflows.ts"]);
  assert.match(read("lib/workflows/crmWorkflows.ts"), /^"use server";/);
  for (const filename of featureFiles().filter(
    (file) => file.endsWith("Skeleton.tsx") || file === "crmSkeletons.tsx",
  )) {
    const source = read("features/crm/" + filename);
    assert.match(source, /@\/components\/blocks\/crm-blocks/);
    assert.doesNotMatch(source, /@\/components\/templates\//);
  }
});
