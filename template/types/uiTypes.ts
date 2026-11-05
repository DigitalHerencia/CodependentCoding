export type LoaderCurveKey = "rose" | "spiral" | "lissajous";
export type ProgressCurveKey = LoaderCurveKey;
export type BackgroundCurveKey = LoaderCurveKey;

export type RevealOptions = {
  rootMargin?: string;
  threshold?: number;
  once?: boolean;
  delay?: number;
};

export type StaggerOptions = {
  delay?: number;
  initialDelay?: number;
  selector?: string;
};

export type PageTransition = "default" | "fade" | "slide";
