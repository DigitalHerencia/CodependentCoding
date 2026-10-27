"use client";

import { useState } from "react";
import { CopyButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CliCommand, CliManifest, CliOption } from "@/types/cliTypes";

type Values = Record<string, string | boolean>;

// Secrets never go into a copied command or a share link; the CLI asks for them.
const secretValue = /url|key|secret|token|password/i;

const field =
  "border-signal-border bg-background-strong text-foreground focus-visible:ring-signal w-full border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:outline-none";

// Single quotes work the same in PowerShell 7 and bash; '' escapes a quote.
function quote(value: string) {
  return /^[A-Za-z0-9._/:=,@-]+$/.test(value)
    ? value
    : `'${value.replace(/'/g, "''")}'`;
}

function withDependencies(manifest: CliManifest, ids: string[]) {
  const all = new Set<string>();
  const visit = (id: string) => {
    if (all.has(id)) return;
    all.add(id);
    manifest.modules
      .find((module) => module.id === id)
      ?.dependsOn.forEach(visit);
  };
  ids.forEach(visit);
  return manifest.modules
    .map((module) => module.id)
    .filter((id) => all.has(id));
}

function buildCommand(command: CliCommand, values: Values) {
  const parts = ["hipster-stack", command.name];
  for (const argument of command.arguments) {
    const value = values[`arg:${argument.name}`];
    if (typeof value === "string" && value.trim()) {
      parts.push(...value.trim().split(/\s+/).map(quote));
    } else if (argument.required) {
      parts.push(`<${argument.name}>`);
    }
  }
  for (const option of command.options) {
    const value = values[option.flag];
    if (option.value) {
      if (
        typeof value === "string" &&
        value.trim() &&
        !secretValue.test(option.flag)
      ) {
        parts.push(option.flag, quote(value.trim()));
      } else if (option.required) {
        parts.push(option.flag, `<${option.value}>`);
      }
    } else if (value === true) {
      parts.push(option.flag);
    }
  }
  return parts.join(" ");
}

function OptionField({
  option,
  manifest,
  values,
  set,
}: {
  option: CliOption;
  manifest: CliManifest;
  values: Values;
  set: (key: string, value: string | boolean) => void;
}) {
  const id = `opt-${option.flag.slice(2)}`;
  const value = values[option.flag];
  const label = (
    <span className="block">
      <code className="text-signal">{option.flag}</code>
      {option.required ? <span className="text-signal"> *</span> : null}
      <span className="block text-foreground-muted">{option.description}</span>
    </span>
  );

  if (!option.value) {
    return (
      <label
        className="flex cursor-pointer items-start gap-3 text-xs"
        htmlFor={id}
      >
        <input
          id={id}
          type="checkbox"
          checked={value === true}
          onChange={(event) => set(option.flag, event.target.checked)}
          className="mt-0.5 size-4 accent-signal"
        />
        {label}
      </label>
    );
  }

  if (secretValue.test(option.flag)) {
    return (
      <div className="border border-dashed border-signal-border p-3 text-xs">
        {label}
        <span className="mt-2 block text-foreground-muted">
          Left out on purpose. Paste it when the CLI asks; secrets don&apos;t
          belong in your shell history.
        </span>
      </div>
    );
  }

  if (option.flag === "--preset") {
    return (
      <label className="block text-xs" htmlFor={id}>
        {label}
        <select
          id={id}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => set(option.flag, event.target.value)}
          className={cn(field, "mt-2")}
        >
          <option value="">No preset</option>
          {Object.entries(manifest.presets).map(([preset, modules]) => (
            <option key={preset} value={preset}>
              {preset}
              {modules.length ? ` (${modules.join(", ")})` : ""}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (option.flag === "--modules" || option.flag === "--module") {
    const multiple = option.flag === "--modules";
    const chosen = typeof value === "string" && value ? value.split(",") : [];
    return (
      <fieldset className="m-0 border border-signal-border p-3 text-xs">
        <legend className="px-1">{label}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {manifest.modules.map((module) => {
            const on = chosen.includes(module.id);
            return (
              <button
                type="button"
                key={module.id}
                aria-pressed={on}
                onClick={() => {
                  const next = multiple
                    ? withDependencies(
                        manifest,
                        on
                          ? chosen.filter((entry) => entry !== module.id)
                          : [...chosen, module.id],
                      )
                    : on
                      ? []
                      : [module.id];
                  set(option.flag, next.join(","));
                }}
                className={cn(
                  "cursor-pointer border px-2.5 py-1 text-xs transition-colors",
                  on
                    ? "border-signal bg-signal-soft text-foreground"
                    : "border-signal-border bg-transparent text-foreground-muted hover:text-foreground",
                )}
              >
                {module.id}
              </button>
            );
          })}
        </div>
        {multiple ? (
          <span className="mt-2 block text-foreground-muted">
            Dependencies tick themselves. Codependency, as advertised.
          </span>
        ) : null}
      </fieldset>
    );
  }

  if (option.flag === "--color") {
    const hex =
      typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value)
        ? value
        : "#2f7a8d";
    return (
      <label className="block text-xs" htmlFor={id}>
        {label}
        <span className="mt-2 flex gap-2">
          <input
            aria-label="Pick a brand color"
            type="color"
            value={hex}
            onChange={(event) => set(option.flag, event.target.value)}
            className="h-9 w-12 cursor-pointer border border-signal-border bg-transparent p-0.5"
          />
          <input
            id={id}
            value={typeof value === "string" ? value : ""}
            placeholder="#2f7a8d"
            onChange={(event) => set(option.flag, event.target.value)}
            className={field}
          />
        </span>
      </label>
    );
  }

  return (
    <label className="block text-xs" htmlFor={id}>
      {label}
      <input
        id={id}
        value={typeof value === "string" ? value : ""}
        placeholder={option.value}
        onChange={(event) => set(option.flag, event.target.value)}
        className={cn(field, "mt-2")}
      />
    </label>
  );
}

export function HipsterBuilder({ manifest }: { manifest: CliManifest }) {
  const [name, setName] = useState(manifest.commands[0]?.name ?? "new");
  const [values, setValues] = useState<Record<string, Values>>({});
  const command = manifest.commands.find((entry) => entry.name === name);
  if (!command) return null;
  const current = values[name] ?? {};
  const set = (key: string, value: string | boolean) =>
    setValues((all) => ({ ...all, [name]: { ...all[name], [key]: value } }));
  const output = buildCommand(command, current);

  return (
    <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <section className="border border-signal-border p-5">
        <div
          role="tablist"
          aria-label="Command"
          className="mb-5 flex flex-wrap gap-2"
        >
          {manifest.commands.map((entry) => (
            <button
              key={entry.name}
              type="button"
              role="tab"
              aria-selected={entry.name === name}
              onClick={() => setName(entry.name)}
              className={cn(
                "cursor-pointer border px-3 py-1.5 text-xs uppercase transition-colors",
                entry.name === name
                  ? "border-signal bg-signal text-foreground"
                  : "border-signal-border bg-transparent text-foreground-muted hover:text-foreground",
              )}
            >
              {entry.name}
            </button>
          ))}
        </div>
        <p className="mt-0 text-xs text-foreground-muted">
          {command.description}
        </p>
        <div className="grid gap-5">
          {command.arguments.map((argument) => (
            <label
              className="block text-xs"
              htmlFor={`arg-${argument.name}`}
              key={argument.name}
            >
              <code className="text-signal">&lt;{argument.name}&gt;</code>
              {argument.required ? (
                <span className="text-signal"> *</span>
              ) : null}
              <span className="block text-foreground-muted">
                {argument.description}
              </span>
              <input
                id={`arg-${argument.name}`}
                value={String(current[`arg:${argument.name}`] ?? "")}
                placeholder={argument.name === "dir" ? "my-app" : argument.name}
                onChange={(event) =>
                  set(`arg:${argument.name}`, event.target.value)
                }
                className={cn(field, "mt-2")}
              />
            </label>
          ))}
          {command.options.map((option) => (
            <OptionField
              key={option.flag}
              option={option}
              manifest={manifest}
              values={current}
              set={set}
            />
          ))}
        </div>
      </section>
      <section className="lg:sticky lg:top-6 lg:self-start">
        <div className="border border-signal bg-background-strong shadow-[0_0_1.5rem_var(--signal-soft)]">
          <div className="flex items-center justify-between border-b border-signal-border px-4 py-2">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-signal" />
              <span className="size-2.5 rounded-full bg-signal-border" />
              <span className="size-2.5 rounded-full bg-signal-soft" />
            </span>
            <span className="text-xs text-foreground-muted">
              PowerShell 7 · bash
            </span>
          </div>
          <pre
            className="m-0 p-5 text-sm break-all whitespace-pre-wrap"
            aria-live="polite"
          >
            <span className="text-signal">PS&gt; </span>
            <code>{output}</code>
            <span className="site-caret" aria-hidden="true">
              ▋
            </span>
          </pre>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <CopyButton value={output} label="Copy CLI command" />
        </div>
        <p className="text-xs text-foreground-muted">
          First time? Link the CLI once from the repo:{" "}
          <code>pnpm cli:link</code>
        </p>
      </section>
    </div>
  );
}
