import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vitest";
import {
  OnboardingProfileFormTemplate,
  OnboardingLoadingTemplate,
} from "@/components/templates/onboarding-templates";
import {
  OnboardingProfileCardBlock,
  OnboardingReviewBlock,
} from "@/components/blocks/onboarding-blocks";

test("initial profile step renders the controlled field without a persistence confirmation", () => {
  const html = renderToStaticMarkup(
    createElement(OnboardingProfileFormTemplate, {
      mode: "complete",
      review: false,
      pending: false,
      saved: false,
      field: "PROFILE_FIELD",
      reviewContent: "REVIEW_CONTENT",
      onSubmit: () => {},
    }),
  );
  expect(html).toContain("PROFILE_FIELD");
  expect(html).not.toContain("REVIEW_CONTENT");
  expect(html).toContain("Review profile");
  expect(html).toContain('method="post"');
});

test("review makes the chosen name explicit and offers edit/save without changing profile authority", () => {
  const review = createElement(OnboardingReviewBlock, {
    name: "Reviewed fixture",
    onBack: () => {},
    pending: false,
  });
  const html = renderToStaticMarkup(
    createElement(OnboardingProfileFormTemplate, {
      mode: "edit",
      review: true,
      pending: false,
      saved: false,
      field: "PROFILE_FIELD",
      reviewContent: review,
      onSubmit: () => {},
    }),
  );
  expect(html).toContain("Reviewed fixture");
  expect(html).toContain("Save profile");
  expect(html).toContain("Edit your profile");
  expect(html).not.toContain("PROFILE_FIELD");
});

test("compact profile cards expose only their own profile DTO and an owned edit link", () => {
  const html = renderToStaticMarkup(
    createElement(OnboardingProfileCardBlock, {
      profile: {
        displayName: "Fixture",
        profileCompletedAt: "2026-01-01T00:00:00.000Z",
      },
    }),
  );
  expect(html).toContain("Fixture");
  expect(html).toContain("Profile complete");
  expect(html).toContain('href="/onboarding/profile"');
  expect(html).not.toContain("organization");
});

test("onboarding skeleton announces loading while decorative shapes stay hidden", () => {
  const html = renderToStaticMarkup(createElement(OnboardingLoadingTemplate));
  expect(html).toContain('role="status"');
  expect(html).toContain('aria-hidden="true"');
});
