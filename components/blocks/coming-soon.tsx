import Link from "next/link";
import { PageHero } from "@/components/blocks/page-hero";

type ComingSoonProps = {
  title: string;
  subtitle: string;
  line: string;
};

export function ComingSoon({ title, subtitle, line }: ComingSoonProps) {
  return (
    <main className="pb-16 text-center">
      <PageHero kicker="The" title={title} subtitle={subtitle} />
      <section className="site-rise mx-auto max-w-md border border-signal-border px-6 py-8">
        <p className="m-0 text-xs tracking-[0.3em] text-signal uppercase">
          Coming soon
        </p>
        <p className="text-sm text-foreground-muted">{line}</p>
        <Link className="brand-button" href="/">
          Back to home
        </Link>
      </section>
    </main>
  );
}
