import {
  capabilityRegistry,
  type ResolvedRecipe,
} from '@hipster-stack/core/browser';
import { Check, Copy, Download, Share2, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ConstituterPreview({
  resolved,
  normalizedJson,
  notice,
  invalidReason,
  onCopyRecipe,
  onDownload,
  onCopyCli,
  onShare,
}: {
  resolved: ResolvedRecipe;
  normalizedJson: string;
  notice: string;
  invalidReason: string;
  onCopyRecipe: () => void;
  onDownload: () => void;
  onCopyCli: () => void;
  onShare: () => void;
}) {
  const application = resolved.application.resolved;
  const includedArtifactSets = application.artifactSets.filter(
    (artifactSet) => artifactSet.included,
  );
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
                  {provider.slot} · {provider.reason}
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

      <section className="builder-handoff" aria-label="Resolved output rollups">
        <article>
          <strong>{application.capabilities.length} Capabilities</strong>
          <small>{application.providers.length} providers</small>
          <span>{application.resources.length} external resources</span>
        </article>
        <article>
          <strong>{application.routes.length} Routes</strong>
          <small>{includedArtifactSets.length} artifact sets</small>
          <span>
            {resolved.application.plan.artifacts.length} cataloged artifacts
          </span>
        </article>
        <article>
          <strong>
            {invalidReason
              ? 'Invalid configuration'
              : application.status === 'valid'
                ? 'Ready to Constitute'
                : 'Setup required'}
          </strong>
          <small>{application.environment.length} environment variables</small>
          <span>{application.setup.length} manual setup steps</span>
        </article>
      </section>

      {invalidReason && (
        <p className="builder-notice" role="alert">
          {invalidReason}
        </p>
      )}

      <section className="output-explorer" aria-label="Output Explorer">
        <div className="recipe-preview-heading">
          <div>
            <strong>Output Explorer</strong>
            <small>Resolved generation consequences before generation</small>
          </div>
          <span>conflicts 0</span>
        </div>

        <details open>
          <summary>Providers · {application.providers.length}</summary>
          {application.providers.map((provider) => (
            <article key={provider.id}>
              <strong>{provider.label}</strong>
              <small>{provider.reason}</small>
              <span>
                {provider.environment.length} environment variables ·{' '}
                {application.artifactSets.find(
                  (set) =>
                    set.id ===
                    (provider.id === 'clerk'
                      ? 'authentication-clerk'
                      : provider.id === 'neon'
                        ? 'persistence-postgresql'
                        : 'commerce-stripe'),
                )?.artifacts.length ?? 0}{' '}
                artifacts
              </span>
            </article>
          ))}
        </details>

        <details>
          <summary>Capabilities · {application.capabilities.length}</summary>
          {application.reasons.map((reason) => (
            <article key={reason.selection}>
              <strong>{reason.selection}</strong>
              <small>{reason.reason}</small>
              <span>
                Required by: {reason.requiredBy.join(', ') || 'user or preset'}
              </span>
            </article>
          ))}
        </details>

        <details>
          <summary>Modules · {application.modules.length}</summary>
          {application.modules.map((module) => {
            const requiredBy = application.capabilities.filter((capability) =>
              capabilityRegistry[capability].modules.includes(module),
            );
            return (
              <article key={module}>
                <strong>{module}</strong>
                <small>
                  Required by:{' '}
                  {requiredBy.join(', ') || 'application foundation'}
                </small>
              </article>
            );
          })}
        </details>

        <details>
          <summary>Routes · {application.routes.length}</summary>
          {application.routes.map((route) => (
            <article key={route.id}>
              <strong>{route.navigationLabel}</strong>
              <small>{route.urlSegment}</small>
              <span>
                {route.routeGroup} · {route.access} ·{' '}
                {route.capability ?? 'foundation'}
              </span>
            </article>
          ))}
        </details>

        <details>
          <summary>
            Resources and environment ·{' '}
            {application.resources.length + application.environment.length}
          </summary>
          <article>
            <strong>Resources</strong>
            <span>{application.resources.join(' · ') || 'None'}</span>
          </article>
          <article>
            <strong>Environment</strong>
            <span>{application.environment.join(' · ') || 'None'}</span>
          </article>
          <article>
            <strong>Required packages</strong>
            <span>
              {resolved.application.plan.requiredPackages.join(' · ') || 'None'}
            </span>
          </article>
          <article>
            <strong>Manual setup</strong>
            <span>{application.setup.join(' · ') || 'None'}</span>
          </article>
          <article>
            <strong>Transforms</strong>
            <span>
              {resolved.application.plan.transforms.join(' · ') || 'None'}
            </span>
          </article>
        </details>

        <details>
          <summary>
            Artifact sets · {includedArtifactSets.length} included ·{' '}
            {resolved.application.plan.filesRetained.length} files retained ·{' '}
            {resolved.application.plan.filesOmitted.length} omitted
          </summary>
          {application.artifactSets.map((artifactSet) => (
            <article key={artifactSet.id}>
              <strong>
                {artifactSet.label} ·{' '}
                {artifactSet.included ? 'included' : 'excluded'}
              </strong>
              <small>
                {artifactSet.artifacts.length} artifacts · policy{' '}
                {artifactSet.policy}
              </small>
              <span>
                {artifactSet.artifacts
                  .slice(0, 4)
                  .map((artifact) => artifact.path)
                  .join(' · ')}
                {artifactSet.artifacts.length > 4 ? ' · …' : ''}
              </span>
            </article>
          ))}
        </details>

        <details>
          <summary>
            Authorization · {application.authorization.model.toUpperCase()}
          </summary>
          {application.authorization.roles.map((role) => (
            <article key={role.name}>
              <strong>{role.displayName}</strong>
              <small>{role.scope}</small>
              <span>{role.permissions.join(' · ') || 'No permissions'}</span>
            </article>
          ))}
        </details>
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
            {application.routes.length} routes · {includedArtifactSets.length}{' '}
            artifact sets
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
