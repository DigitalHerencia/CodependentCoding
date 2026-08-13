import * as React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface PanelProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'title'
> {
  eyebrow?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  footer?: React.ReactNode;
  contentClassName?: string;
}

export function Panel({
  eyebrow,
  title,
  description,
  actions,
  footer,
  children,
  className,
  contentClassName,
  ...props
}: PanelProps) {
  const hasHeader = eyebrow || title || description || actions;

  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      {hasHeader ? (
        <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="grid gap-1.5">
            {eyebrow ? (
              <span className="font-body text-[0.62rem] font-bold uppercase tracking-[0.12em] text-signal">
                {eyebrow}
              </span>
            ) : null}
            {title ? <CardTitle>{title}</CardTitle> : null}
            {description ? (
              <CardDescription>{description}</CardDescription>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          ) : null}
        </CardHeader>
      ) : null}
      <CardContent className={cn('p-4 sm:p-5', contentClassName)}>
        {children}
      </CardContent>
      {footer ? <CardFooter>{footer}</CardFooter> : null}
    </Card>
  );
}
