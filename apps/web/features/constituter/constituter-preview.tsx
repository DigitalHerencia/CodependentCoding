import type { ResolvedRecipe } from '@hipster-stack/core/browser';
import { Check, Copy, Download, Share2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

const fixedStack = [
  ['Clerk', 'Auth'],
  ['Organizations', 'Tenancy'],
  ['Local RBAC', 'Authorization'],
  ['Neon/Postgres', 'Database'],
  ['Prisma + RLS', 'Data boundary'],
  ['Hipster Stack', 'Architecture'],
] as const;

export function ConstituterPreview({
  resolved,
  normalizedJson,
  notice,
  onCopyRecipe,
  onDownload,
  onCopyCli,
  onShare,
}: {
  resolved: ResolvedRecipe;
  normalizedJson: string;
  notice: string;
  onCopyRecipe: () => void;
  onDownload: () => void;
  onCopyCli: () => void;
  onShare: () => void;
}) {
  return (
    <aside className="recipe-preview">
      <div className="recipe-preview-heading">
        <div>
          <strong>Constitution Preview</strong>
          <small>{resolved.summary.preset.label}</small>
        </div>
        <span>schema v{resolved.recipe.schemaVersion}</span>
      </div>

      <section className="selected-stack" aria-label="Constituted system">
        <p>Constituted System</p>
        <div>
          {fixedStack.map(([name, role]) => (
            <article key={name}>
              <i>
                <Check aria-hidden="true" />
              </i>
              <span>
                <strong>{name}</strong>
                <small>{role}</small>
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="recipe-code">
        <div>
          <span>hipsterstack.json</span>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onCopyRecipe}
          >
            <Copy aria-hidden="true" /> Copy
          </Button>
        </div>
        <pre>{normalizedJson}</pre>
      </section>

      {resolved.summary.autoIncluded.length > 0 && (
        <p className="builder-auto-included">
          <strong>Resolved automatically:</strong>{' '}
          {resolved.summary.autoIncluded.join(', ')}
        </p>
      )}

      <section className="builder-handoff">
        <article>
          <strong>Includes</strong>
          <small>
            {resolved.summary.included.length} resolved capabilities
          </small>
          <span>{resolved.summary.included.slice(0, 3).join(' · ')}</span>
        </article>
        <article>
          <strong>Works With</strong>
          <small>Docs + CLI</small>
          <span>Portable, stateless recipe</span>
        </article>
        <article>
          <strong>Output</strong>
          <small>User-owned application</small>
          <span>One template · deterministic build</span>
        </article>
      </section>

      <div className="builder-output-actions">
        <Button size="sm" type="button" onClick={onDownload}>
          <Download aria-hidden="true" /> Download JSON
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={onCopyCli}>
          <Terminal aria-hidden="true" /> Copy CLI Command
        </Button>
        <Button variant="outline" size="sm" type="button" onClick={onShare}>
          <Share2 aria-hidden="true" /> Copy Share URL
        </Button>
      </div>
      <p className="builder-privacy">
        No account or server state. Export the recipe and generate locally.
      </p>
      {notice && (
        <p className="builder-notice" role="status">
          {notice}
        </p>
      )}
    </aside>
  );
}
