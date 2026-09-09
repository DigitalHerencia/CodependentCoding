"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSocialPost } from "@/lib/actions/socialActions";
import { SocialComposeTemplate } from "@/components/templates/socialComposeTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SocialAccountDTO } from "@/types/socialTypes";
export function ComposerFeatureClient({
  accounts,
}: {
  accounts: SocialAccountDTO[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  return (
    <SocialComposeTemplate
      preview={
        <>
          <p className="type-label">{title}</p>
          <p className="whitespace-pre-wrap">
            {content || "Your post preview will appear here."}
          </p>
          <p className="text-muted-primary">
            {content.length} characters · {selected.length} channels
          </p>
        </>
      }
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setPending(true);
          try {
            await createSocialPost({
              title,
              content,
              variants: selected.map((socialAccountId) => ({
                socialAccountId,
                content,
              })),
            });
            router.push("/social/calendar");
            router.refresh();
          } catch {
            setError(
              "Draft could not be saved. Check selected accounts, channel character limits, and permissions.",
            );
          } finally {
            setPending(false);
          }
        }}
      >
        <div className="form-field">
          <Label htmlFor="social-title">Internal title</Label>
          <Input
            id="social-title"
            value={title}
            maxLength={200}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="form-field">
          <Label htmlFor="social-content">Post content</Label>
          <textarea
            id="social-content"
            className="control-field min-h-64"
            required
            value={content}
            onChange={(event) => setContent(event.target.value)}
          />
        </div>
        <fieldset className="space-y-2">
          <legend className="type-label">Publish destinations</legend>
          {accounts.map((account) => (
            <label className="flex items-center gap-3" key={account.id}>
              <input
                type="checkbox"
                checked={selected.includes(account.id)}
                onChange={(event) =>
                  setSelected((current) =>
                    event.target.checked
                      ? [...current, account.id]
                      : current.filter((id) => id !== account.id),
                  )
                }
              />
              {account.displayName} · {account.provider}
            </label>
          ))}
          {!accounts.length && <p>No active social accounts are available.</p>}
        </fieldset>
        {error && <p role="alert">{error}</p>}
        <Button type="submit" disabled={pending || !selected.length}>
          {pending ? "Saving…" : "Save draft"}
        </Button>
      </form>
    </SocialComposeTemplate>
  );
}
