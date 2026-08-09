'use client';

import type { NormalizedRecipe } from '@loaded-vibes/core/browser';
import { useState } from 'react';
import { getPreviewSurfaces, type PreviewSurfaceId } from '@/lib/preview';

function productLanguage(recipe: NormalizedRecipe) {
  if (recipe.product === 'client-portal') {
    return {
      singular: 'workspace',
      plural: 'workspaces',
      action: 'Open client workspace',
    };
  }
  if (recipe.product === 'platform-marketplace') {
    return {
      singular: 'listing',
      plural: 'listings',
      action: 'Review new listing',
    };
  }
  return { singular: 'project', plural: 'projects', action: 'Create project' };
}

export function LivePreview({ recipe }: { recipe: NormalizedRecipe }) {
  const [active, setActive] = useState<PreviewSurfaceId>('dashboard');
  const surfaces = getPreviewSurfaces(recipe);
  const selected =
    surfaces.find((surface) => surface.id === active) ?? surfaces[0]!;
  const language = productLanguage(recipe);

  return (
    <div className="live-preview">
      <div
        className="preview-tabs"
        role="tablist"
        aria-label="Representative application surfaces"
      >
        {surfaces.map((surface) => (
          <button
            key={surface.id}
            type="button"
            role="tab"
            aria-selected={active === surface.id}
            data-active={active === surface.id}
            data-unavailable={!surface.available}
            onClick={() => setActive(surface.id)}
          >
            {surface.label}
          </button>
        ))}
      </div>

      <div className="app-frame" data-navigation={recipe.design.navigation}>
        <header className="app-bar">
          <span className="app-logo">
            {recipe.identity.displayName.slice(0, 2).toUpperCase()}
          </span>
          <strong>{recipe.identity.displayName}</strong>
          <span className="avatar">JD</span>
        </header>
        <nav className="app-nav" aria-label="Preview navigation">
          <span className="nav-label">Workspace</span>
          <b>Overview</b>
          <span>{language.plural}</span>
          {recipe.modules.billing && <span>Billing</span>}
          <span>Settings</span>
        </nav>
        <section className="app-canvas" role="tabpanel">
          {!selected.available ? (
            <UnavailableSurface
              label={selected.label}
              requirement={selected.requirement!}
            />
          ) : (
            <PreviewSurface
              surface={active}
              recipe={recipe}
              language={language}
            />
          )}
        </section>
      </div>
      <p className="representative-note">
        Representative preview · content illustrates generated surfaces, not
        live product data.
      </p>
    </div>
  );
}

function UnavailableSurface({
  label,
  requirement,
}: {
  label: string;
  requirement: string;
}) {
  return (
    <div className="surface-empty">
      <span>Not in this recipe</span>
      <h3>{label} stays out.</h3>
      <p>
        Enable {requirement.toLowerCase()} to include and preview this generated
        surface.
      </p>
    </div>
  );
}

function SurfaceHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="surface-heading">
      <span>{eyebrow}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function PreviewSurface({
  surface,
  recipe,
  language,
}: {
  surface: PreviewSurfaceId;
  recipe: NormalizedRecipe;
  language: ReturnType<typeof productLanguage>;
}) {
  if (surface === 'onboarding') {
    return (
      <div className="surface-content onboarding-surface">
        <div className="progress-meta">
          <strong>Set up your workspace</strong>
          <span>2 of 3</span>
        </div>
        <div className="progress-track">
          <i />
        </div>
        <div className="wizard-card">
          <span className="surface-icon">02</span>
          <h3>Invite your team</h3>
          <p>
            Bring the people who will help run {recipe.identity.displayName}.
          </p>
          <div className="fake-input">teammate@company.com</div>
          <button>Continue</button>
        </div>
      </div>
    );
  }

  if (surface === 'settings') {
    return (
      <div className="surface-content">
        <SurfaceHeading
          eyebrow="Settings"
          title="Account and workspace"
          description="Identity stays provider-owned. Product authorization remains local."
        />
        <div className="settings-grid">
          <div>
            <span className="avatar large">JD</span>
            <strong>Jordan Diaz</strong>
            <small>jordan@example.com</small>
          </div>
          <div>
            <small>Workspace</small>
            <strong>{recipe.identity.displayName}</strong>
            <button>Manage members</button>
          </div>
        </div>
      </div>
    );
  }

  if (surface === 'billing') {
    return (
      <div className="surface-content">
        <SurfaceHeading
          eyebrow="Billing"
          title="Plan and usage"
          description="Hosted checkout and verified webhooks keep subscription truth reliable."
        />
        <div className="plan-card">
          <div>
            <small>Current plan</small>
            <strong>Growth</strong>
            <span>Active · renews Sep 9</span>
          </div>
          <b>
            $49<small>/mo</small>
          </b>
        </div>
        <div className="usage">
          <span>
            <b>8</b> of 12 seats
          </span>
          <i>
            <em />
          </i>
        </div>
        {recipe.modules.stripeConnect && (
          <div className="connect-note">
            <b>Connect enabled</b>
            <span>Platform payments are included in this recipe.</span>
          </div>
        )}
      </div>
    );
  }

  if (surface === 'workflow') {
    return (
      <div className="surface-content">
        <SurfaceHeading
          eyebrow="Owner"
          title="Launch plan"
          description={`A representative ${language.singular} detail backed by authorized server workflows.`}
        />
        <div className="detail-grid">
          <div className="detail-form">
            <label>Name</label>
            <div>Launch plan</div>
            <label>Description</label>
            <div>Coordinate the product rollout.</div>
            <button>Save {language.singular}</button>
          </div>
          <div className="member-list">
            <strong>Members</strong>
            <span>
              <i>JD</i> Jordan Diaz <b>Owner</b>
            </span>
            <span>
              <i>AK</i> Avery Kim <b>Member</b>
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (surface === 'marketing') {
    return (
      <div className="surface-content marketing-surface">
        <span className="marketing-pill">Built for focused teams</span>
        <h3>
          {recipe.identity.description ||
            `Move your work forward with ${recipe.identity.displayName}.`}
        </h3>
        <p>
          A clear public starting point that hands qualified users into the
          product.
        </p>
        <div>
          <button>Start free</button>
          <button className="secondary">See how it works</button>
        </div>
        <div className="trust-row">
          <span>Fast onboarding</span>
          <span>Team ready</span>
          <span>Secure by default</span>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-content">
      <SurfaceHeading
        eyebrow="Workspace dashboard"
        title="Operational center"
        description={`See what is moving across your ${language.plural}.`}
      />
      <div className="stat-row">
        <div>
          <small>Active {language.plural}</small>
          <b>{recipe.modules.sampleDomain ? '12' : '—'}</b>
        </div>
        <div>
          <small>Team members</small>
          <b>{recipe.modules.invitations ? '8' : '1'}</b>
        </div>
        <div>
          <small>Plan</small>
          <b>{recipe.modules.billing ? 'Growth' : 'Free'}</b>
        </div>
      </div>
      <div className="activity-card">
        <div>
          <strong>Recent activity</strong>
          <button>{language.action}</button>
        </div>
        <span>
          <i />
          Launch plan <small>Updated 12m ago</small>
        </span>
        <span>
          <i />
          Customer research <small>Updated yesterday</small>
        </span>
      </div>
    </div>
  );
}
