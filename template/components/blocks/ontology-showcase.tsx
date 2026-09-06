import type { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface OntologyShowcaseProps {
  items: readonly {
    id: string;
    title: string;
    content: ReactNode;
    routes: readonly string[];
    workflow: string;
    surfaces: readonly string[];
  }[];
}

export function OntologyShowcase({ items }: OntologyShowcaseProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 lg:px-12">
      <h2 className="mb-10 text-3xl font-black uppercase">
        Supported Ontologies
      </h2>
      <nav
        aria-label="Supported ontologies"
        className="mb-10 flex flex-wrap gap-3"
      >
        {items.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="border border-muted px-3 py-2 text-sm hover:bg-primary"
          >
            {String(index + 1).padStart(2, "0")} / {item.title}
          </a>
        ))}
      </nav>
      <div className="space-y-8">
        {items.map((item, index) => (
          <article
            key={item.id}
            id={item.id}
            className="grid scroll-mt-28 border border-muted/60 bg-background lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
          >
            <div className="p-6 sm:p-8">
              <Badge variant="outline" className="mb-5">
                ONTOLOGY {String(index + 1).padStart(2, "0")}
              </Badge>
              <h3 className="mb-5 text-2xl font-black uppercase">
                {item.title}
              </h3>
              <div className="leading-7 [&_p]:my-4 [&_ul]:my-5 [&_ul]:grid [&_ul]:gap-2 [&_ul]:border-l-2 [&_ul]:border-primary [&_ul]:pl-5">
                {item.content}
              </div>
            </div>
            <div className="min-w-0 border-t border-muted/50 bg-primary/10 p-6 sm:p-8 lg:border-t-0 lg:border-l">
              <h4 className="mb-4 text-sm font-bold tracking-widest uppercase">
                Application routes
              </h4>
              <div className="flex flex-wrap gap-3">
                {item.routes.map((route) => (
                  <Button key={route} variant="outline" size="sm" asChild>
                    <Link href={route}>{route}</Link>
                  </Button>
                ))}
              </div>
              <dl className="mt-8 space-y-5 text-sm">
                <div>
                  <dt className="mb-2 font-bold uppercase">Workflow</dt>
                  <dd className="font-mono wrap-break-word text-muted">
                    {item.workflow}
                  </dd>
                </div>
                <div>
                  <dt className="mb-2 font-bold uppercase">
                    Implementation surfaces
                  </dt>
                  <dd className="space-y-2 font-mono wrap-break-word text-muted">
                    {item.surfaces.map((surface) => (
                      <p key={surface}>{surface}</p>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
