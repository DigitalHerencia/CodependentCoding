/** Auth shell blocks contracts and composition for the owning application slice. */
import Link from "next/link";
import { cacheLife } from "next/cache";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { applicationProduct } from "@/content/application";
import {
  authHeaderContent,
  authFooterContent,
  authContent,
} from "@/content/auth";
/** The auth group's only navigation: a quiet way back to the landing page. */
export function AuthHeaderBlock() {
  return (
    <>
      <Link
        href={authHeaderContent.homeHref}
        className="inline-flex auth-back-link min-h-9 type-link items-center"
      >
        {authHeaderContent.homeLabel}
      </Link>
    </>
  );
}

/** The year is part of the static page; the cached value refreshes daily. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Copyright only, under the form. */
export function AuthFooterBlock() {
  return (
    <footer className="auth-footer">
      <p className="type-caption text-foreground/70">
        &copy; <CopyrightYear /> {applicationProduct.name}.{" "}
        {authFooterContent.rightsReserved}
      </p>
    </footer>
  );
}

export function AuthBrandBlock() {
  return (
    <div className="auth-content space-y-5">
      <p className="eyebrow text-muted-primary">{authContent.eyebrow}</p>
      <h1 className="uppercase">{authContent.title}</h1>
      <p className="reading-copy text-foreground/80">
        {authContent.description}
      </p>
    </div>
  );
}
export function AuthLogoBlock() {
  return <LogoLockup size="auth" />;
}
