import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

interface CanonicalSurfaceProps {
  description: string;
  eyebrow: string;
  image: string;
  nextHref: string;
  nextLabel: string;
  title: string;
}

export function CanonicalSurface({
  description,
  eyebrow,
  image,
  nextHref,
  nextLabel,
  title,
}: CanonicalSurfaceProps) {
  return (
    <main className="canonical-surface">
      <div className="canonical-surface-copy">
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{description}</span>
        <div className="canonical-surface-actions">
          <Link
            className={buttonVariants({ variant: 'default' })}
            href={nextHref}
          >
            {nextLabel}
            <ArrowRight aria-hidden="true" />
          </Link>
          <Link className={buttonVariants({ variant: 'outline' })} href="/">
            Return home
          </Link>
        </div>
      </div>
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        width={1600}
        height={420}
        sizes="(min-width: 64rem) 48rem, 90vw"
      />
    </main>
  );
}
