import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Upgrade Strategy - Loaded Vibes',
  description: 'Keep your customizations safe while staying up to date.',
};

export default function UpgradeStrategyPage() {
  return (
    <DocPage
      title="Upgrade Strategy"
      description="Updates without tears. Keep your customizations while getting the latest features."
      breadcrumbs={[
        { label: 'Guides', href: '/docs/guides/running-devcycles' },
        { label: 'Upgrade Strategy', href: '/docs/guides/upgrade-strategy' },
      ]}
      prevPage={{ label: 'Customization', href: '/docs/guides/customization' }}
      nextPage={{ label: 'Troubleshooting', href: '/docs/guides/troubleshooting' }}
    >
      <h2>Upgrade Strategies</h2>
      <p>
        Loaded Vibes offers three upgrade strategies, each suited to different needs. Choose based
        on how much you've customized the framework.
      </p>

      <div className="not-prose my-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 p-6">
          <h3 className="mb-2 font-display text-lg text-cyan-300">Mirror</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Clean slate. Replace all framework files with the new version.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-cyan-400">
            Best for: Minimal customization
          </p>
        </div>

        <div className="rounded-xl border-2 border-pink-500/50 bg-pink-500/10 p-6">
          <h3 className="mb-2 font-display text-lg text-pink-300">Merge</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Smart merge. Preserve customizations, apply non-conflicting updates.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-pink-400">
            Best for: Moderate customization
          </p>
        </div>

        <div className="rounded-xl border-2 border-purple-500/50 bg-purple-500/10 p-6">
          <h3 className="mb-2 font-display text-lg text-purple-300">Sandbox</h3>
          <p className="mb-3 text-xs text-muted-foreground">
            Test first. Apply updates to a copy, validate, then promote.
          </p>
          <p className="text-[10px] uppercase tracking-wider text-purple-400">
            Best for: Heavy customization
          </p>
        </div>
      </div>

      <h2>Mirror Strategy</h2>
      <p>
        The mirror strategy replaces all framework files with the new version. Your customizations
        in separate files are preserved.
      </p>

      <CodeBlock language="bash">
        {`# Check what will change
lv upgrade --strategy mirror --dry-run

# Apply mirror upgrade
lv upgrade --strategy mirror

# What happens:
# 1. Backup current state
# 2. Replace all @framework files
# 3. Preserve files you created
# 4. Run validation`}
      </CodeBlock>

      <Callout type="warning" title="Destructive">
        Mirror will overwrite any changes you made to framework files. Use only if you haven't
        modified core framework assets.
      </Callout>

      <h3>When to Use</h3>
      <ul>
        <li>Fresh installation with minimal customization</li>
        <li>You only add new artifacts, never modify existing ones</li>
        <li>You want the cleanest possible upgrade path</li>
      </ul>

      <h2>Merge Strategy</h2>
      <p>
        The merge strategy attempts to preserve your changes while applying non-conflicting updates.
        It uses a 3-way merge algorithm.
      </p>

      <CodeBlock language="bash">
        {`# Check for conflicts
lv upgrade --strategy merge --dry-run

# Apply merge upgrade
lv upgrade --strategy merge

# What happens:
# 1. Backup current state
# 2. Analyze differences
# 3. Apply non-conflicting changes
# 4. Mark conflicts for manual resolution
# 5. Run validation`}
      </CodeBlock>

      <h3>Handling Conflicts</h3>
      <CodeBlock language="bash">
        {`# After merge with conflicts
lv upgrade status

# Output:
# Upgrade Status: Conflicts detected
# 
# Files with conflicts:
# - .github/instructions/nextjs.instructions.md
# - .github/toolsets/default.toolset.jsonc
#
# Run: lv upgrade resolve

# Resolve conflicts interactively
lv upgrade resolve

# Or resolve manually and mark done
lv upgrade resolve --manual`}
      </CodeBlock>

      <h3>Conflict Resolution</h3>
      <p>Conflicts are marked with standard conflict markers:</p>

      <CodeBlock title="Conflict markers" language="text">
        {`<<<<<<< YOURS
Your customized content here
=======
New framework content here
>>>>>>> THEIRS`}
      </CodeBlock>

      <h3>When to Use</h3>
      <ul>
        <li>You've customized framework files but want updates</li>
        <li>You're comfortable resolving merge conflicts</li>
        <li>You want to review each change before applying</li>
      </ul>

      <h2>Sandbox Strategy</h2>
      <p>
        The sandbox strategy applies updates to a copy, letting you test before committing to the
        upgrade.
      </p>

      <CodeBlock language="bash">
        {`# Create sandbox with upgrade
lv upgrade --strategy sandbox

# What happens:
# 1. Create .loaded-vibes/sandbox/
# 2. Apply upgrade to sandbox
# 3. Keep production unchanged

# Test in sandbox
cd .loaded-vibes/sandbox
lv doctor
lv devcycle run validate

# If satisfied, promote to production
lv upgrade promote

# Or discard and try again
lv upgrade discard`}
      </CodeBlock>

      <h3>Sandbox Testing</h3>
      <CodeBlock language="bash">
        {`# Run tests in sandbox
lv upgrade sandbox test

# Compare behavior
lv upgrade sandbox compare

# Output:
# Comparing sandbox vs production:
# 
# ✓ DevCycle: init - identical behavior
# ✓ DevCycle: scaffold - identical behavior
# ! DevCycle: deploy - new checkpoint required
# 
# 2 changes detected. Review before promoting.`}
      </CodeBlock>

      <h3>When to Use</h3>
      <ul>
        <li>Heavy customization that might break with updates</li>
        <li>Production project where you can't risk downtime</li>
        <li>You want to thoroughly test before upgrading</li>
      </ul>

      <h2>Backup & Restore</h2>

      <h3>Automatic Backups</h3>
      <p>By default, upgrades create automatic backups:</p>

      <CodeBlock language="bash">
        {`# Backups are stored in
.loaded-vibes/backups/
├── 2024-01-15-pre-upgrade/
├── 2024-01-10-pre-upgrade/
└── 2024-01-05-pre-upgrade/

# List backups
lv restore --list

# Restore from backup
lv restore backup 2024-01-15-pre-upgrade`}
      </CodeBlock>

      <h3>Manual Backup</h3>
      <CodeBlock language="bash">
        {`# Create manual backup
lv backup create --name "before-major-upgrade"

# Export for external storage
lv backup export --output backup.tar.gz

# Import backup
lv backup import backup.tar.gz`}
      </CodeBlock>

      <h2>Version Pinning</h2>
      <p>Pin to a specific version to prevent automatic updates:</p>

      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "version": "1.2.3",
  "features": {
    "upgrades": {
      "strategy": "merge",
      "autoCheck": true,
      "autoUpgrade": false,
      "pinnedVersion": "1.2.x"
    }
  }
}`}
      </CodeBlock>

      <h2>Upgrade Checklist</h2>

      <h3>Before Upgrading</h3>
      <ol>
        <li>Review release notes for breaking changes</li>
        <li>
          Run <code>lv doctor</code> to ensure healthy state
        </li>
        <li>Commit all local changes</li>
        <li>Create manual backup if important</li>
        <li>
          Run <code>lv upgrade --dry-run</code> to preview
        </li>
      </ol>

      <h3>After Upgrading</h3>
      <ol>
        <li>
          Run <code>lv doctor</code> to verify health
        </li>
        <li>
          Run <code>lv artifact validate</code> to check artifacts
        </li>
        <li>Test critical DevCycles</li>
        <li>Review any deprecation warnings</li>
        <li>Update custom artifacts if needed</li>
      </ol>

      <h2>Rollback</h2>
      <p>If an upgrade goes wrong:</p>

      <CodeBlock language="bash">
        {`# Quick rollback to pre-upgrade state
lv rollback

# Rollback to specific backup
lv rollback --to 2024-01-15-pre-upgrade

# Rollback specific files only
lv rollback --files ".github/instructions/*"`}
      </CodeBlock>

      <Callout type="tip" title="Safe rollback">
        Rollback preserves any new files you created after the upgrade. It only reverts framework
        files to their previous state.
      </Callout>

      <h2>Configuration Reference</h2>
      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "features": {
    "upgrades": {
      "strategy": "merge",           // mirror, merge, sandbox
      "autoBackup": true,            // Create backup before upgrade
      "autoCheck": true,             // Check for updates periodically
      "autoUpgrade": false,          // Apply updates automatically
      "checkFrequency": "weekly",    // never, daily, weekly, monthly
      "pinnedVersion": null,         // Pin to version pattern (e.g., "1.x")
      "backupRetention": 5           // Number of backups to keep
    }
  }
}`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Check out the <a href="/docs/guides/troubleshooting">troubleshooting guide</a> for
        upgrade-related issues, or return to <a href="/docs/guides/customization">customization</a>{' '}
        to learn how to structure your modifications for easy upgrades.
      </p>
    </DocPage>
  );
}
