"use client";

import { ArrowDown, FileCode2, GitBranch } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type MapView = "system" | "read" | "write";

type Bucket = {
  id: string;
  title: string;
  pattern: RegExp;
};

type Layer = {
  id: string;
  title: string;
  caption: string;
  buckets: readonly Bucket[];
};

const LAYERS: Record<string, Layer> = {
  routes: {
    id: "routes",
    title: "01 / ENTRY POINTS",
    caption: "URL ownership and inbound HTTP requests",
    buckets: [
      { id: "tenant", title: "Tenant routes", pattern: /^app\/\(tenant\)\// },
      { id: "public", title: "Public routes", pattern: /^app\/\(public\)\// },
      { id: "http", title: "HTTP / webhooks", pattern: /^app\/api\// },
      { id: "other-routes", title: "Other app files", pattern: /^app\/(?!\(tenant\)|\(public\)|api\/)/ },
    ],
  },
  features: {
    id: "features",
    title: "02 / FEATURE COMPOSITION",
    caption: "Server features and browser interaction islands",
    buckets: [
      { id: "crm-features", title: "CRM feature files", pattern: /^features\/crm\// },
      { id: "other-features", title: "Other features", pattern: /^features\/(?!crm\/)/ },
    ],
  },
  presentation: {
    id: "presentation",
    title: "03 / PRESENTATION",
    caption: "Page templates constitute blocks; blocks constitute primitives",
    buckets: [
      { id: "templates", title: "Page templates", pattern: /^components\/templates\// },
      { id: "blocks", title: "UI blocks", pattern: /^components\/blocks\// },
      { id: "primitives", title: "UI primitives", pattern: /^components\/ui\// },
      { id: "shells", title: "Shells, navigation and charts", pattern: /^components\/(shells|nav|chart)\// },
      { id: "other-components", title: "Other presentation", pattern: /^components\/(?!templates\/|blocks\/|ui\/|shells\/|nav\/|chart\/)/ },
    ],
  },
  application: {
    id: "application",
    title: "04 / APPLICATION LOGIC",
    caption: "Named workflows compose read and write operations",
    buckets: [
      { id: "workflows", title: "Workflow compositions", pattern: /^lib\/workflows\// },
      { id: "fetchers", title: "Read blocks / fetchers", pattern: /^lib\/fetchers\// },
      { id: "actions", title: "Write blocks / actions", pattern: /^lib\/actions\// },
      { id: "integrations", title: "Integration adapters", pattern: /^lib\/integrations\// },
      { id: "auth", title: "Authentication and authorization", pattern: /^lib\/(auth|authz)\// },
    ],
  },
  contracts: {
    id: "contracts",
    title: "05 / CONTRACTS",
    caption: "Types, runtime schemas, constants and content",
    buckets: [
      { id: "schemas", title: "Zod schemas", pattern: /^schemas\// },
      { id: "types", title: "Type contracts", pattern: /^types\// },
      { id: "content", title: "Static content", pattern: /^content\// },
      { id: "utilities", title: "Utilities, constants and cache", pattern: /^lib\/(utils|constants|cache)\// },
    ],
  },
  data: {
    id: "data",
    title: "06 / PERSISTENCE",
    caption: "DTO mapping, Prisma projections, transactions and tenancy",
    buckets: [
      { id: "selects", title: "Prisma selects", pattern: /^lib\/db\/selects\// },
      { id: "dtos", title: "DTO mappers", pattern: /^lib\/db\/(dtos|dto)\// },
      { id: "transactions", title: "Transaction helpers", pattern: /^lib\/db\/transactions\// },
      { id: "database", title: "Tenancy, RLS and database infrastructure", pattern: /^lib\/db\/(?!selects\/|dtos\/|dto\/|transactions\/)/ },
      { id: "prisma", title: "Prisma schema and migrations", pattern: /^prisma\// },
    ],
  },
};

type TraceStep = {
  label: string;
  path: string;
  meaning: string;
};

const READ_TRACE: readonly TraceStep[] = [
  { label: "ROUTE", path: "app/(tenant)/crm/accounts/page.tsx", meaning: "URL, criteria, Suspense" },
  { label: "SERVER FEATURE", path: "features/crm/crmAccountsFeature.tsx", meaning: "Composes workflow and page template" },
  { label: "READ WORKFLOW", path: "lib/workflows/crmWorkflows.ts", meaning: "loadCrmAccountsWorkflow" },
  { label: "FETCHER", path: "lib/fetchers/crmFetchers.ts", meaning: "Tenant-scoped authorized read" },
  { label: "PRISMA SELECT", path: "lib/db/selects/crmSelects.ts", meaning: "Which columns are selected" },
  { label: "DTO MAPPER", path: "lib/db/dtos/crmDtos.ts", meaning: "Database record becomes view data" },
  { label: "PAGE TEMPLATE", path: "components/templates/crm-templates.tsx", meaning: "Arranges the page" },
  { label: "UI BLOCK", path: "components/blocks/crm-blocks.tsx", meaning: "Renders the records" },
];

const WRITE_TRACE: readonly TraceStep[] = [
  { label: "EDIT ROUTE", path: "app/(tenant)/crm/accounts/[accountId]/edit/page.tsx", meaning: "Loads the edit page" },
  { label: "SERVER FEATURE", path: "features/crm/crmEditAccountFeature.tsx", meaning: "Loads the authorized account" },
  { label: "CLIENT FORM", path: "features/crm/crmEditAccountForm.tsx", meaning: "Owns React Hook Form and submit" },
  { label: "SERVER WORKFLOW", path: "lib/workflows/crmWorkflows.ts", meaning: "Client-callable server function invokes the action" },
  { label: "APPLICATION ACTION", path: "lib/actions/crmActions.ts", meaning: "Validates, authorizes, writes, invalidates" },
  { label: "TENANT TRANSACTION", path: "lib/db/tenancy.ts", meaning: "Scopes database access to one organization" },
  { label: "DTO MAPPER", path: "lib/db/dtos/crmDtos.ts", meaning: "Returns client-safe account data" },
];

function FileButtons({
  files,
  active,
  selectFile,
}: {
  files: readonly string[];
  active: string;
  selectFile: (file: string) => void;
}) {
  const initial = files.slice(0, 12);
  const overflow = files.slice(12);

  const renderButton = (file: string) => (
    <button
      type="button"
      key={file}
      title={file}
      className={"anthimeria-file-node" + (file === active ? " is-active" : "")}
      onClick={() => selectFile(file)}
    >
      <FileCode2 aria-hidden="true" className="size-3.5 shrink-0" />
      <span>{file.split("/").at(-1)}</span>
    </button>
  );

  return (
    <>
      <div className="anthimeria-files">{initial.map(renderButton)}</div>
      {overflow.length > 0 && (
        <details className="anthimeria-more">
          <summary>Show {overflow.length} more files</summary>
          <div className="anthimeria-files">{overflow.map(renderButton)}</div>
        </details>
      )}
    </>
  );
}

function LayerBox({
  layer,
  files,
  active,
  selectFile,
  initialOpen = false,
}: {
  layer: Layer;
  files: readonly string[];
  active: string;
  selectFile: (file: string) => void;
  initialOpen?: boolean;
}) {
  const entries = layer.buckets.map((bucket) => ({
    ...bucket,
    files: files.filter((file) => bucket.pattern.test(file)),
  }));
  const count = entries.reduce((total, entry) => total + entry.files.length, 0);

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={initialOpen ? "contents" : undefined}
      className="anthimeria-layer"
    >
      <AccordionItem value="contents" className="anthimeria-layer-item border-0">
        <AccordionTrigger className="anthimeria-layer-trigger py-3 hover:text-foreground">
          <span className="flex min-w-0 flex-col gap-1 text-left">
            <span className="anthimeria-layer-name">{layer.title}</span>
            <span className="anthimeria-layer-caption">{layer.caption}</span>
          </span>
          <span className="anthimeria-count">{count}</span>
        </AccordionTrigger>
        <AccordionContent className="anthimeria-layer-contents pb-3">
          <Accordion type="multiple" className="anthimeria-subgroups">
            {entries.filter((entry) => entry.files.length > 0).map((entry) => (
              <AccordionItem
                key={entry.id}
                value={entry.id}
                className="anthimeria-subgroup"
              >
                <AccordionTrigger className="anthimeria-subgroup-trigger py-2 hover:text-foreground">
                  <span className="anthimeria-subgroup-label">{entry.title}</span>
                  <span className="anthimeria-count">{entry.files.length}</span>
                </AccordionTrigger>
                <AccordionContent className="pb-3">
                  <FileButtons
                    files={entry.files}
                    active={active}
                    selectFile={selectFile}
                  />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function FlowConnector({ split = false }: { split?: boolean }) {
  return (
    <div className={"anthimeria-connector" + (split ? " is-branch" : "")} aria-hidden="true">
      {split ? <GitBranch className="size-5" /> : <ArrowDown className="size-5" />}
    </div>
  );
}

function ArchitectureOverview({
  files, active, selectFile,
}: {
  files: readonly string[];
  active: string;
  selectFile: (file: string) => void;
}) {
  return (
    <div className="anthimeria-diagram" aria-label="Architecture composition">
      <LayerBox layer={LAYERS.routes} files={files} active={active} selectFile={selectFile} initialOpen />
      <FlowConnector />
      <LayerBox layer={LAYERS.features} files={files} active={active} selectFile={selectFile} initialOpen />
      <FlowConnector split />
      <div className="anthimeria-split-branches">
        <LayerBox layer={LAYERS.presentation} files={files} active={active} selectFile={selectFile} initialOpen />
        <LayerBox layer={LAYERS.application} files={files} active={active} selectFile={selectFile} initialOpen />
      </div>
      <FlowConnector />
      <div className="anthimeria-split-branches">
        <LayerBox layer={LAYERS.contracts} files={files} active={active} selectFile={selectFile} />
        <LayerBox layer={LAYERS.data} files={files} active={active} selectFile={selectFile} />
      </div>
    </div>
  );
}

function ExecutionTrace({
  steps, files, active, selectFile,
}: {
  steps: readonly TraceStep[];
  files: readonly string[];
  active: string;
  selectFile: (file: string) => void;
}) {
  const available = new Set(files);
  return (
    <ol className="anthimeria-trace">
      {steps.map((step, index) => (
        <li key={step.path} className="anthimeria-trace-step">
          <span className="anthimeria-trace-number">{String(index + 1).padStart(2, "0")}</span>
          <div className="min-w-0">
            {available.has(step.path) ? (
              <button
                type="button"
                className={"anthimeria-trace-button" + (active === step.path ? " is-active" : "")}
                onClick={() => selectFile(step.path)}
              >
                <strong>{step.label}</strong>
                <span>{step.path}</span>
              </button>
            ) : (
              <div className="anthimeria-trace-button is-unavailable">
                <strong>{step.label}</strong>
                <span>{step.path}</span>
              </div>
            )}
            <p className="anthimeria-trace-description">{step.meaning}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Pure presentation graph: given known source paths, shows hierarchy and named traces. */
export function AnthimeriaArchitectureMap({
  files, active, selectFile, view, setView,
}: {
  files: readonly string[];
  active: string;
  selectFile: (file: string) => void;
  view: MapView;
  setView: (view: MapView) => void;
}) {
  const options: readonly { value: MapView; title: string }[] = [
    { value: "system", title: "SYSTEM" },
    { value: "read", title: "READ TRACE" },
    { value: "write", title: "WRITE TRACE" },
  ];
  return (
    <div className="anthimeria-map">
      <div className="anthimeria-map-toolbar">
        <div className="anthimeria-mode-buttons" aria-label="Architecture diagram modes">
          {options.map((option) => (
            <button
              type="button"
              key={option.value}
              onClick={() => setView(option.value)}
              aria-pressed={view === option.value}
              className="anthimeria-mode-button"
            >
              {option.title}
            </button>
          ))}
        </div>
        <span className="anthimeria-map-count">{files.length} source files</span>
      </div>
      <p className="anthimeria-map-explainer">
        {view === "system"
          ? "Hierarchy shows ownership and composition. Expand a layer, then a sublayer, then tap a file to inspect its code."
          : "The CRM trace follows named files in the existing Maximal Template. Select a stage to inspect the original source."}
      </p>
      {view === "system" ? (
        <ArchitectureOverview files={files} active={active} selectFile={selectFile} />
      ) : (
        <ExecutionTrace
          steps={view === "read" ? READ_TRACE : WRITE_TRACE}
          files={files}
          active={active}
          selectFile={selectFile}
        />
      )}
      <p className="anthimeria-map-foot">
        {view === "system"
          ? "Arrows show architectural composition, not a runtime call stack. READ and WRITE trace the actual CRM example files."
          : "These stages show a representative execution path; inspect the source for exact function calls and branches."}
      </p>
    </div>
  );
}
