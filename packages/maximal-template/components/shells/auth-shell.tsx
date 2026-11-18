/** Auth shell contracts and composition for the owning application slice. */
import type { AuthShellProps } from "@/types/authTypes";

import styles from "@/components/shells/auth-shell.module.css";

/**
 * Split screen: the brand side carries the header (back to the landing) and
 * the headline; the form side carries the page and the footer. Sign-up mirrors
 * sign-in through CSS (`data-auth-variant` on the form panel), not the URL.
 */
export function AuthShell({
  children,
  header,
  brand,
  logo,
  footer,
}: AuthShellProps) {
  return (
    <div className={`auth-layout ${styles.layout}`}>
      <section className="auth-brand-panel auth-panel">
        {header}
        <div className="auth-copy-placement">{brand}</div>
      </section>
      <section className="auth-form-column auth-panel bg-primary/10 text-foreground">
        <div aria-hidden className="auth-header-spacer" />
        <main className="auth-form-placement">
          <div className="auth-content">
            <div className="auth-brand-placement">{logo}</div>
            {children}
          </div>
        </main>
        {footer}
      </section>
    </div>
  );
}
