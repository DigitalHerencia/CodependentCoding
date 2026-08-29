export interface RevealOptions {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  delay?: number;
}

export interface StaggerOptions {
  delay?: number;
  initialDelay?: number;
  selector?: string;
}

export type PageTransition = "default" | "fade" | "slide";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function observeReveal(
  element: HTMLElement,
  options: RevealOptions = {},
): () => void {
  if (prefersReducedMotion()) {
    element.dataset.revealed = "true";
    return () => undefined;
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      window.setTimeout(() => {
        element.dataset.revealed = "true";
      }, options.delay ?? 0);
      if (options.once !== false) observer.unobserve(element);
    },
    {
      rootMargin: options.rootMargin,
      threshold: options.threshold ?? 0.15,
    },
  );

  observer.observe(element);
  return () => observer.disconnect();
}

export function staggerChildren(
  element: HTMLElement,
  options: StaggerOptions = {},
): () => void {
  const children = element.querySelectorAll<HTMLElement>(
    options.selector ?? ":scope > *",
  );
  children.forEach((child, index) => {
    child.style.animationDelay = `${(options.initialDelay ?? 0) + index * (options.delay ?? 80)}ms`;
  });
  return () =>
    children.forEach((child) => child.style.removeProperty("animation-delay"));
}

export async function triggerAnimation(
  element: Element,
  animationClass: string,
): Promise<void> {
  element.classList.remove(animationClass);
  void (element as HTMLElement).offsetWidth;
  element.classList.add(animationClass);
  await Promise.allSettled(
    element.getAnimations().map((animation) => animation.finished),
  );
  element.classList.remove(animationClass);
}

export function startViewTransition(
  callback: () => void | Promise<void>,
  recipe: PageTransition = "default",
): unknown {
  document.documentElement.dataset.pageTransition = recipe;
  const start = document.startViewTransition?.bind(document);
  if (!start || prefersReducedMotion()) return callback();
  return start(callback);
}
