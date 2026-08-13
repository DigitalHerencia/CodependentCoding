import {
  capabilityRegistry,
  designChoices,
  productPresets,
  type Design,
  type ProductPresetId,
  type ResolvedRecipe,
} from '@hipster-stack/core/browser';
import { Download } from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  setCapability,
  type ConfigurableCapability,
  type ConfiguratorRecipe,
} from '@/lib/configurator';

const surfaceCapabilities = [
  'invitations',
  'onboarding',
  'admin',
  'marketing',
  'sampleDomain',
] as const satisfies readonly ConfigurableCapability[];

const revenueCapabilities = [
  'billing',
  'stripeConnect',
] as const satisfies readonly ConfigurableCapability[];

function title(value: string) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (letter) => letter.toUpperCase());
}

function packageSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-_]+/, '');
}

export function ConstituterControls({
  draft,
  resolved,
  setDraft,
  onPresetChange,
  onDownload,
}: {
  draft: ConfiguratorRecipe;
  resolved: ResolvedRecipe;
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
  onPresetChange: (product: ProductPresetId) => void;
  onDownload: () => void;
}) {
  return (
    <section className="builder-controls" id="builder-controls">
      <fieldset className="builder-group preset-group">
        <legend>
          <i>A</i>
          <span>
            <strong>Starting point</strong>
            <small>One template, four real presets</small>
          </span>
        </legend>
        <div className="builder-options preset-options">
          {(
            Object.values(
              productPresets,
            ) as (typeof productPresets)[ProductPresetId][]
          ).map((preset) => (
            <Button
              variant="ghost"
              type="button"
              data-active={draft.product === preset.id}
              key={preset.id}
              onClick={() => onPresetChange(preset.id)}
            >
              <i /> {preset.label}
            </Button>
          ))}
        </div>
      </fieldset>

      <fieldset className="builder-group identity-group">
        <legend>
          <i>B</i>
          <span>
            <strong>Product identity</strong>
            <small>Name the repository and product</small>
          </span>
        </legend>
        <div className="builder-fields">
          <label htmlFor="constituter-package-name">
            <span>Package name</span>
            <Input
              id="constituter-package-name"
              value={draft.name}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  name: packageSlug(event.target.value),
                })
              }
            />
          </label>
          <label htmlFor="constituter-display-name">
            <span>Display name</span>
            <Input
              id="constituter-display-name"
              value={draft.identity.displayName}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  identity: {
                    ...draft.identity,
                    displayName: event.target.value,
                  },
                })
              }
            />
          </label>
          <label
            className="builder-description-field"
            htmlFor="constituter-description"
          >
            <span>One-line promise</span>
            <Input
              id="constituter-description"
              maxLength={160}
              value={draft.identity.description}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  identity: {
                    ...draft.identity,
                    description: event.target.value,
                  },
                })
              }
            />
          </label>
        </div>
      </fieldset>

      <CapabilityGroup
        letter="C"
        title="Product surfaces"
        description="Optional routes and owned features"
        capabilities={surfaceCapabilities}
        setDraft={setDraft}
        resolved={resolved.recipe.modules}
      />
      <CapabilityGroup
        letter="D"
        title="Revenue"
        description="Billing and platform payments"
        capabilities={revenueCapabilities}
        setDraft={setDraft}
        resolved={resolved.recipe.modules}
      />

      <fieldset className="builder-group design-group">
        <legend>
          <i>E</i>
          <span>
            <strong>Design</strong>
            <small>Bounded visual direction</small>
          </span>
        </legend>
        <div className="design-selects">
          {(Object.keys(designChoices) as (keyof Design)[]).map((key) => (
            <label key={key}>
              <span>{title(key)}</span>
              <Select
                value={draft.design[key]}
                onValueChange={(value) =>
                  setDraft({
                    ...draft,
                    design: {
                      ...draft.design,
                      [key]: value as Design[typeof key],
                    },
                  })
                }
              >
                <SelectTrigger aria-label={title(key)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {designChoices[key].map((value) => (
                      <SelectItem value={value} key={value}>
                        {title(value)}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </label>
          ))}
        </div>
      </fieldset>

      <Button className="builder-download" type="button" onClick={onDownload}>
        Download Recipe <Download aria-hidden="true" data-icon="inline-end" />
      </Button>
    </section>
  );
}

function CapabilityGroup({
  letter,
  title: groupTitle,
  description,
  capabilities,
  setDraft,
  resolved,
}: {
  letter: string;
  title: string;
  description: string;
  capabilities: readonly ConfigurableCapability[];
  setDraft: Dispatch<SetStateAction<ConfiguratorRecipe>>;
  resolved: ResolvedRecipe['recipe']['modules'];
}) {
  return (
    <fieldset className="builder-group capability-group">
      <legend>
        <i>{letter}</i>
        <span>
          <strong>{groupTitle}</strong>
          <small>{description}</small>
        </span>
      </legend>
      <div className="builder-options capability-options">
        {capabilities.map((id) => {
          const enabled =
            id === 'sampleDomain'
              ? resolved.sampleDomain !== false
              : resolved[id];
          return (
            <div className="capability-option" data-active={enabled} key={id}>
              <Switch
                aria-label={capabilityRegistry[id].label}
                checked={enabled}
                onCheckedChange={(checked) =>
                  setDraft((current) => setCapability(current, id, checked))
                }
              />
              <span>{capabilityRegistry[id].label}</span>
            </div>
          );
        })}
      </div>
    </fieldset>
  );
}
