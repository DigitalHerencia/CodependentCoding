'use client';

import type { ProductPresetId } from '@hipster-stack/core/browser';
import Image from 'next/image';
import { ArrowDown, Copy } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  createCliCommand,
  createShareUrl,
  defaultConfiguratorRecipe,
  deserializeRecipe,
  resolveConfiguratorRecipe,
  selectProductPreset,
  serializeRecipe,
  type ConfiguratorRecipe,
} from '@/lib/configurator';
import digitalHerenciaDesert from '../../../../public/Digital Herencia Desert BG.png';
import { ConstituterControls } from './constituter-controls';
import { ConstituterPreview } from './constituter-preview';

export function Constituter() {
  const [draft, setDraft] = useState<ConfiguratorRecipe>(
    defaultConfiguratorRecipe,
  );
  const [notice, setNotice] = useState('');
  const lastValid = useRef(
    resolveConfiguratorRecipe(defaultConfiguratorRecipe),
  );

  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get('recipe');
    if (!encoded) return;
    try {
      setDraft(deserializeRecipe(encoded));
    } catch {
      setNotice(
        'That shared recipe could not be read, so we kept a safe default.',
      );
    }
  }, []);

  const resolution = useMemo(() => {
    try {
      return { resolved: resolveConfiguratorRecipe(draft), error: '' };
    } catch (error) {
      return {
        resolved: undefined,
        error:
          error instanceof Error ? error.message : 'Invalid configuration.',
      };
    }
  }, [draft]);
  const resolved = resolution.resolved ?? lastValid.current;
  useEffect(() => {
    if (resolution.resolved) lastValid.current = resolution.resolved;
  }, [resolution.resolved]);
  const normalizedJson = useMemo(
    () =>
      resolution.resolved
        ? JSON.stringify(
            {
              applicationDefinition:
                resolution.resolved.application.resolved.definition,
            },
            null,
            2,
          )
        : '',
    [resolution.resolved],
  );

  async function copy(value: string, message: string) {
    try {
      await navigator.clipboard.writeText(value);
      setNotice(message);
    } catch {
      setNotice('Clipboard access is unavailable in this browser.');
    }
  }

  function downloadRecipe() {
    if (resolution.error) {
      setNotice(`Invalid configuration: ${resolution.error}`);
      return;
    }
    const blob = new Blob([`${serializeRecipe(draft)}\n`], {
      type: 'application/json',
    });
    const href = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'hipsterstack.json';
    anchor.click();
    URL.revokeObjectURL(href);
    setNotice('hipsterstack.json downloaded.');
  }

  function shareRecipe() {
    if (resolution.error) {
      setNotice(`Invalid configuration: ${resolution.error}`);
      return;
    }
    void copy(
      createShareUrl(draft, window.location.href),
      'Share link copied.',
    );
  }

  function choosePreset(product: ProductPresetId) {
    setDraft((current) => selectProductPreset(current, product));
  }

  return (
    <>
      <main className="builder-page">
        <header className="builder-heading">
          <h1>The Constituter™</h1>
          <p>
            No, Simples™ cannot be composed &quot;Hipster-Wise&quot;. They are
            simply a dynamic system arranged in a configuration that is
            Hipster-ing™.
          </p>
          <small className="builder-nihilism">
            Mereological sums remain outside the supported configuration model.
          </small>
          <div className="builder-top-actions">
            <a
              className={buttonVariants({ variant: 'default' })}
              href="#builder-controls"
            >
              Start Config
              <ArrowDown aria-hidden="true" data-icon="inline-end" />
            </a>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                if (resolution.error) {
                  setNotice(`Invalid configuration: ${resolution.error}`);
                  return;
                }
                void copy(normalizedJson, 'Application Definition copied.');
              }}
            >
              Copy Application Definition
              <Copy aria-hidden="true" data-icon="inline-end" />
            </Button>
          </div>
        </header>

        <div className="builder-workspace">
          <ConstituterControls
            draft={draft}
            resolved={resolved}
            setDraft={setDraft}
            onPresetChange={choosePreset}
            onDownload={downloadRecipe}
          />
          <ConstituterPreview
            resolved={resolved}
            normalizedJson={normalizedJson}
            notice={notice}
            invalidReason={resolution.error}
            onCopyRecipe={() => {
              if (resolution.error) {
                setNotice(`Invalid configuration: ${resolution.error}`);
                return;
              }
              void copy(normalizedJson, 'Application Definition copied.');
            }}
            onDownload={downloadRecipe}
            onCopyCli={() => {
              if (resolution.error) {
                setNotice(`Invalid configuration: ${resolution.error}`);
                return;
              }
              void copy(createCliCommand(draft), 'CLI command copied.');
            }}
            onShare={shareRecipe}
          />
        </div>
      </main>
      <Image
        className="constituter-landscape"
        src={digitalHerenciaDesert}
        alt=""
        aria-hidden="true"
        sizes="100vw"
      />
    </>
  );
}
