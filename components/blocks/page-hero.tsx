type PageHeroProps = {
  kicker: string;
  title: string;
  subtitle: string;
};

export function PageHero({ kicker, title, subtitle }: PageHeroProps) {
  return (
    <header className="site-rise mx-auto max-w-4xl px-4 pt-12 pb-8 text-center">
      <p className="m-0 font-heading text-sm tracking-[0.3em] text-signal uppercase">
        {kicker}
      </p>
      <h1 className="m-0 text-4xl leading-none text-balance sm:text-6xl">
        {title}
      </h1>
      <p className="mt-3 mb-0 text-xs tracking-[0.25em] text-foreground-muted uppercase">
        {subtitle}
      </p>
    </header>
  );
}
