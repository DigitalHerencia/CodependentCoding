import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const boundaries = [
  [
    "Reads",
    "Persisted reads enter through lib/fetchers and tenant-scoped transactions.",
  ],
  [
    "Writes",
    "Authenticated CRUD enters through lib/actions with RBAC and ABAC checks.",
  ],
  [
    "Providers",
    "Provider SDK behavior stays in lib/integrations; routes own HTTP lifecycle.",
  ],
  [
    "Presentation",
    "UI primitives compose into pure blocks, features, and thin routes.",
  ],
];

export default function Page() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <div className="flex gap-2">
          <Badge>RLS SCOPED</Badge>
          <Badge variant="outline">DEFAULT DENY</Badge>
        </div>
        <h1 className="text-4xl font-black uppercase">
          Architecture & security
        </h1>
        <p className="text-muted-foreground">
          One coherent application with explicit ownership and authorization
          boundaries.
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {boundaries.map(([title, description]) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
