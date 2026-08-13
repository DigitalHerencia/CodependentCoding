import type { ResolvedRecipe } from '@hipster-stack/core/browser';
import { Check, Copy, Download, Share2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const application = resolved.application.resolved;
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
          {application.providers.map((provider) => (
            <article key={provider.id}>
              <i>
                <Check aria-hidden="true" />
              </i>
              <span>
                <strong>{provider.label}</strong>
                <small>
                  {provider.slot} · required by {provider.requiredBy.length}
                </small>
              </span>
            </article>
          ))}
          <article>
            <i>
              <Check aria-hidden="true" />
            </i>
            <span>
              <strong>{application.authorization.model.toUpperCase()}</strong>
              <small>Authorization · independent from authentication</small>
            </span>
          </article>
        </div>
      </section>

      <section className="recipe-code">
        <div>
          <span>Application Definition · hipsterstack.json</span>
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={onCopyRecipe}
          >
            <Copy aria-hidden="true" /> Copy definition
          </Button>
        </div>
        <pre>{normalizedJson}</pre>
      </section>

      {resolved.summary.autoIncluded.length > 0 && (
        <p className="builder-auto-included">
          <strong>Resolved automatically:</strong>{' '}
          {application.reasons
            .filter((reason) =>
              application.autoIncluded.includes(reason.selection),
            )
            .map((reason) => reason.reason)
            .join(' ')}
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
          <span>One portable Application Definition</span>
        </article>
        <article>
          <strong>Output</strong>
          <small>
            {application.routes.length} routes ·{' '}
            {application.artifactSets.length} artifact sets
          </small>
          <span>{application.environment.length} environment requirements</span>
        </article>
      </section>

      <div className="builder-output-actions">
        <Button size="sm" type="button" onClick={onDownload}>
          <Download aria-hidden="true" /> Download definition
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
