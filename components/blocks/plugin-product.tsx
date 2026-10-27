import Link from "next/link";
import { CodeSnippet } from "@/components/blocks/code-snippet";
import { PageHero } from "@/components/blocks/page-hero";
import { loadedVibesCopy } from "@/lib/constants/siteCopy";
import type { PluginManifest } from "@/types/pluginTypes";

// Skill descriptions end with trigger phrases for Claude; show only the "what".
function summary(description: string) {
  return description.split(/\.\s+Use\b/)[0]?.replace(/\.$/, "") + ".";
}

export function PluginProduct({ plugin }: { plugin: PluginManifest }) {
  return (
    <main className="pb-16">
      <PageHero
        kicker={loadedVibesCopy.kicker}
        title={loadedVibesCopy.title}
        subtitle={loadedVibesCopy.subtitle}
      />
      <p className="site-rise mx-auto max-w-2xl px-4 text-center text-sm text-foreground-muted">
        {plugin.description}
      </p>
      <p className="text-center text-xs tracking-[0.3em] text-signal uppercase">
        v{plugin.version} · {loadedVibesCopy.tagline}
      </p>

      <section className="mx-auto mt-12 max-w-4xl px-4">
        <h2 className="text-xl">Get started in three pastes</h2>
        <div className="grid gap-4">
          {loadedVibesCopy.install.map((step) => (
            <CodeSnippet key={step.title} title={step.title} code={step.code} />
          ))}
        </div>
        <p className="text-xs text-foreground-muted">
          {loadedVibesCopy.installNote}
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="text-center text-xl">The skills</h2>
        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {plugin.skills.map((skill, index) => (
            <li
              className="site-rise flex flex-col border border-signal-border bg-background-strong p-5 transition-[border-color,box-shadow] hover:border-signal hover:shadow-[0_0_1.2rem_var(--signal-soft)]"
              key={skill.name}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <h3 className="m-0 text-base">/{skill.name}</h3>
              <p className="flex-1 text-xs leading-relaxed text-foreground-muted">
                {summary(skill.description)}
              </p>
              <code className="text-xs text-signal">
                /loaded-vibes:{skill.name}
              </code>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4">
        <h2 className="text-center text-xl">The supervisors</h2>
        <ul className="m-0 grid list-none gap-4 p-0 md:grid-cols-2">
          {[...plugin.agents, ...loadedVibesCopy.hooks].map((part) => (
            <li className="border border-signal-border p-5" key={part.name}>
              <h3 className="m-0 text-sm">{part.name}</h3>
              <p className="mb-0 text-xs leading-relaxed text-foreground-muted">
                {summary(part.description)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto mt-12 max-w-4xl px-4">
        <h2 className="text-center text-xl">A day with Loaded Vibes</h2>
        <ol className="m-0 list-none space-y-4 border-l border-signal-border p-0 pl-6">
          {loadedVibesCopy.day.map((step) => (
            <li className="text-xs" key={step.time}>
              <span className="text-signal">{step.time}</span>
              <span className="text-foreground-muted"> · {step.text}</span>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-center text-xs">
          <Link className="brand-button" href="/faq">
            Still have questions? Read the FAQ
          </Link>
        </p>
      </section>
    </main>
  );
}
