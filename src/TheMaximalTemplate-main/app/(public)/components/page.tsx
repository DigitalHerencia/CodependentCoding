import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <Badge>PURE UI</Badge>
        <h1 className="text-4xl font-black uppercase">Components & blocks</h1>
        <p className="text-muted-foreground">
          Presentation primitives compose into category blocks without data,
          authorization, provider, or workflow ownership.
        </p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>UI primitives</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Badge>Badge</Badge>
            <Badge variant="outline">Status</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Block categories</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Heroes, feature sections, pricing, FAQs, application sections,
            tables, loading states, errors, calls to action, and more.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
