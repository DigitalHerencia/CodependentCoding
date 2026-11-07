// components/nav/auth-footer.tsx

import { cacheLife } from "next/cache";

import { applicationProduct } from "@/content/application";
import { authFooterContent } from "@/content/auth";

/** The year is part of the static page; the cached value refreshes daily. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

/** Copyright only, under the form. */
export function AuthFooter() {
  return (
    <footer className="auth-footer">
      <p className="type-caption text-foreground/70">
        &copy; <CopyrightYear /> {applicationProduct.name}.{" "}
        {authFooterContent.rightsReserved}
      </p>
    </footer>
  );
}
