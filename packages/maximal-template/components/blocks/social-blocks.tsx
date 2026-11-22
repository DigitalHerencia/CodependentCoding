"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { socialCopy } from "@/content/social";
import type {
  SocialCalendarProps,
  SocialComposeProps,
  SocialMediaProps,
  SocialMediaControlsProps,
  SocialFieldProps,
  SocialTargetsProps,
  SocialSubmitProps,
  SocialSkeletonProps,
  SocialToolbarProps,
  SocialVariantReviewProps,
} from "@/types/socialTypes";
import Image from "next/image";
import Link from "next/link";

/** Resolve search presentation while the client feature owns query state. */
function SocialSearchBlock({ query, onQueryChange }: SocialToolbarProps) {
  return (
    <Input
      aria-label={socialCopy.search}
      placeholder={socialCopy.search}
      value={query}
      onChange={(event) => onQueryChange(event.target.value)}
    />
  );
}
/** Render lifecycle evidence and UTC chronological grouping from authorized posts. */
export function SocialCalendarBlock({
  groups,
  toolbarProps,
  renderControls,
}: SocialCalendarProps) {
  return (
    <section className="space-y-5 p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="type-title">{socialCopy.calendar}</h1>
        <Link className="type-link" href="/social/compose">
          {socialCopy.compose}
        </Link>
      </div>
      <p className="text-muted-primary">{socialCopy.calendarScope}</p>
      <SocialSearchBlock {...toolbarProps} />
      {groups.map(({ date, items }) => (
        <section className="space-y-3" key={date}>
          <h2 className="type-label">
            {date === "unscheduled" ? socialCopy.unscheduled : `${date} UTC`}
          </h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {items.map((post) => (
              <Card key={post.id} className="space-y-3 p-5">
                <h3 className="type-label">
                  {post.title || socialCopy.untitled}
                </h3>
                <p className="whitespace-pre-wrap">{post.content}</p>
                <p>
                  {socialCopy.status[post.status]}
                  {post.scheduledAt
                    ? ` · ${post.scheduledAt.slice(11, 16)} UTC`
                    : ""}
                </p>
                {post.status === "PUBLISHED" && post.publishedAt && (
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                )}
                {post.approvedAt && (
                  <p>
                    {socialCopy.approved} ·{" "}
                    {post.approvedBy?.displayName ?? socialCopy.member} ·{" "}
                    {new Date(post.approvedAt).toISOString()}
                  </p>
                )}
                <ul className="space-y-3">
                  {post.variants.map((variant) => (
                    <li key={variant.id}>
                      <p className="type-label">
                        {variant.accountDisplayName} · {variant.provider} ·{" "}
                        {socialCopy.variantStatus[variant.status]}
                      </p>
                    </li>
                  ))}
                </ul>
                {renderControls(post)}
              </Card>
            ))}
          </div>
        </section>
      ))}
      {!groups.length && <p>{socialCopy.noPosts}</p>}
    </section>
  );
}

/** Display exact target content for the requested revision. */
export function SocialVariantReviewBlock({
  variants,
  onReview,
  pending,
  unavailable,
}: SocialVariantReviewProps) {
  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={onReview}
        disabled={pending}
        aria-expanded={variants !== null}
      >
        {pending
          ? socialCopy.loading
          : variants
            ? socialCopy.hideVariants
            : socialCopy.reviewVariants}
      </Button>
      {unavailable && <FieldError>{socialCopy.reviewUnavailable}</FieldError>}
      {variants && (
        <ul className="space-y-3">
          {variants.map((variant) => (
            <li key={variant.id}>
              <p className="type-label">{variant.accountDisplayName}</p>
              <p className="wrap-anywhere whitespace-pre-wrap">
                {variant.content}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
/** Render parent and account-specific previews directly from the current form payload. */
export function SocialComposeBlock({
  children,
  title,
  content,
  variants,
  accounts,
}: SocialComposeProps) {
  return (
    <section className="space-y-5 p-5">
      <h1 className="type-title">{socialCopy.compose}</h1>
      <div className="grid gap-5 lg:grid-cols-[3fr_2fr]">
        <Card className="p-5">{children}</Card>
        <aside className="space-y-4">
          <h2 className="type-label">{socialCopy.preview}</h2>
          <Card className="space-y-3 p-5">
            <p className="type-label">{title}</p>
            <p className="whitespace-pre-wrap">
              {content || socialCopy.previewEmpty}
            </p>
            <p>
              {content.length} {socialCopy.codeUnits}
            </p>
          </Card>
          {variants.map((variant) => (
            <Card className="space-y-3 p-5" key={variant.socialAccountId}>
              <p className="type-label">
                {
                  accounts.find(
                    (account) => account.id === variant.socialAccountId,
                  )?.displayName
                }
              </p>
              <p className="whitespace-pre-wrap">{variant.content}</p>
              <p>
                {variant.content.length} {socialCopy.codeUnits}
              </p>
            </Card>
          ))}
        </aside>
      </div>
    </section>
  );
}
/** Render canonical primitive fields using form-owned bindings. */
export function SocialFieldBlock({
  kind,
  id,
  accountName,
  error,
  inputProps,
  textareaProps,
}: SocialFieldProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <FieldLabel htmlFor={id}>
        {socialCopy.fields[kind]}
        {accountName ? ` · ${accountName}` : ""}
      </FieldLabel>
      {textareaProps ? (
        <Textarea
          {...textareaProps}
          id={id}
          aria-invalid={Boolean(error)}
          className="min-h-32"
        />
      ) : (
        <Input {...inputProps} id={id} aria-invalid={Boolean(error)} />
      )}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
/** Render distinct account references without implying provider execution support. */
export function SocialTargetsBlock({
  accounts,
  selected,
  onToggle,
  onBlur,
  error,
}: SocialTargetsProps) {
  return (
    <Field data-invalid={Boolean(error)}>
      <fieldset className="space-y-2">
        <legend className="type-label">{socialCopy.targets}</legend>
        {accounts.map((account) => (
          <FieldLabel key={account.id} className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={selected.includes(account.id)}
              onBlur={onBlur}
              onChange={(event) => onToggle(account.id, event.target.checked)}
              aria-invalid={Boolean(error)}
            />
            {account.displayName} · {account.provider}
          </FieldLabel>
        ))}
        {!accounts.length && <p>{socialCopy.noAccounts}</p>}
      </fieldset>
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}
/** Describe a successful local mutation using its specific persisted effect. */
export function SocialSubmitBlock({
  kind,
  pending,
  disabled,
  error,
  saved,
}: SocialSubmitProps) {
  return (
    <div className="space-y-2">
      {error && (
        <FieldError>
          {error === "UNAVAILABLE" ? socialCopy.unavailable : error}
        </FieldError>
      )}
      <Button type="submit" disabled={pending || disabled}>
        {pending ? socialCopy.saving : socialCopy.submit[kind]}
      </Button>
      {saved && <p role="status">{socialCopy.saved[kind]}</p>}
      {kind === "schedule" && (
        <p className="text-sm text-muted-primary">
          {socialCopy.scheduleIntent}
        </p>
      )}
    </div>
  );
}
/** Render uploads-owned assets and supplied browser controls without a second shell. */
export function SocialMediaBlock({
  assets,
  toolbarProps,
  children,
  renderControls,
}: SocialMediaProps) {
  return (
    <section className="space-y-5 p-5">
      <h1 className="type-title">{socialCopy.media}</h1>
      <p className="text-muted-primary">{socialCopy.mediaScope}</p>
      <SocialSearchBlock {...toolbarProps} />
      {children}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {assets.map((asset) => (
          <Card className="space-y-3 p-5" key={asset.id}>
            <h2 className="type-label break-all">{asset.filename}</h2>
            <p>{asset.contentType}</p>
            <p>
              {asset.byteSize} {socialCopy.bytes}
            </p>
            <p>{asset.createdAt.slice(0, 10)}</p>
            {renderControls(asset)}
          </Card>
        ))}
      </div>
      {!assets.length && <p>{socialCopy.noMedia}</p>}
    </section>
  );
}
/** Render restricted image previews and truthful artifact interaction outcomes. */
export function SocialMediaControlsBlock({
  asset,
  preview,
  pending,
  error,
  outcome,
  onOpen,
  onPreviewError,
  onPreviewLoad,
}: SocialMediaControlsProps) {
  return (
    <div className="space-y-3">
      {preview && (
        <Image
          src={preview}
          onLoad={onPreviewLoad}
          onError={onPreviewError}
          unoptimized
          width={640}
          height={360}
          className="aspect-video w-full object-contain"
          alt={asset.filename}
        />
      )}
      <Button disabled={pending} size="sm" onClick={onOpen}>
        {pending
          ? socialCopy.loading
          : asset.canPreview
            ? socialCopy.previewImage
            : socialCopy.download}
      </Button>
      <p role="status">
        {error
          ? socialCopy.artifactFailed
          : outcome === "download"
            ? socialCopy.downloadStarted
            : outcome === "preview"
              ? socialCopy.previewReady
              : ""}
      </p>
    </div>
  );
}
/** Render a route-specific skeleton directly for Suspense boundaries. */
export function SocialSkeletonBlock({ variant }: SocialSkeletonProps) {
  return (
    <section
      aria-busy="true"
      aria-label={socialCopy.loading}
      className="space-y-5 p-5"
    >
      <Skeleton className="h-9 w-64" />
      <Skeleton className="h-10 w-full" />
      <div
        className={
          variant === "compose"
            ? "grid gap-5 lg:grid-cols-2"
            : "grid gap-5 sm:grid-cols-2 xl:grid-cols-4"
        }
      >
        {[0, 1, 2, 3].map((key) => (
          <Card key={key} className="space-y-4 p-5">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-28 w-full" />
          </Card>
        ))}
      </div>
    </section>
  );
}
