import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeroProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  'title'
> {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  align?: 'start' | 'center';
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  align = 'start',
  className,
  ...props
}: PageHeroProps) {
  return (
    <section
      className={cn(
        'px-4 py-8 sm:px-6 md:py-12 lg:px-8',
        align === 'center' && 'text-center',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-col gap-4',
          align === 'center' && 'items-center',
        )}
      >
        {eyebrow ? (
          <div className="font-body text-[0.68rem] font-bold uppercase tracking-[0.14em] text-signal">
            {eyebrow}
          </div>
        ) : null}
        <h1 className="m-0 max-w-5xl font-heading text-4xl leading-[0.95] font-bold uppercase tracking-[0.01em] text-foreground sm:text-5xl md:text-6xl">
          {title}
        </h1>
        {description ? (
          <div className="max-w-3xl font-body text-sm leading-7 text-foreground-muted sm:text-base">
            {description}
          </div>
        ) : null}
        {actions ? (
          <div
            className={cn(
              'flex w-full flex-col gap-2 pt-2 sm:w-auto sm:flex-row',
              align === 'center' && 'sm:justify-center',
            )}
          >
            {actions}
          </div>
        ) : null}
      </div>
    </section>
  );
}
