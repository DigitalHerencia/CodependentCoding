import {
  SupportAnalyticsBlock,
  SupportArticleBlock,
  SupportConversationBlock,
  SupportFormBlock,
  SupportHeadingBlock,
  SupportInboxBlock,
  SupportKnowledgeBlock,
  SupportPaginationBlock,
  SupportUnavailableBlock,
} from "@/components/blocks/support-blocks";
import type {
  SupportAnalyticsView,
  SupportArticleView,
  SupportConversationView,
  SupportFormView,
  SupportInboxView,
  SupportKnowledgeView,
  SupportPageKind,
  SupportPager,
} from "@/types/supportTypes";
import type { ActionErrorCode } from "@/types/actionTypes";
import type { ReactNode } from "react";

/** Compose the support route's section inside the existing tenant layout. */
function SupportSection({
  page,
  children,
}: {
  page?: SupportPageKind;
  children: ReactNode;
}) {
  return (
    <section className="space-y-5 p-5">
      {page && <SupportHeadingBlock page={page} />}
      {children}
    </section>
  );
}

/** Compose the inbox filters, ticket rows and adjacent-page navigation. */
export function SupportInboxTemplate({
  pager,
  ...view
}: SupportInboxView & { pager: SupportPager }) {
  return (
    <SupportSection page="inbox">
      <SupportInboxBlock {...view} />
      <SupportPaginationBlock {...pager} />
    </SupportSection>
  );
}

/** Compose the published knowledge search and results. */
export function SupportKnowledgeBaseTemplate({
  pager,
  ...view
}: SupportKnowledgeView & { pager: SupportPager }) {
  return (
    <SupportSection page="knowledge">
      <SupportKnowledgeBlock {...view} />
      <SupportPaginationBlock {...pager} />
    </SupportSection>
  );
}

/** Compose the ticket detail and supported form slots. */
export function SupportTicketTemplate(view: SupportConversationView) {
  return (
    <SupportSection>
      <SupportConversationBlock {...view} />
    </SupportSection>
  );
}

/** Compose the published article detail page. */
export function SupportArticleTemplate(view: SupportArticleView) {
  return (
    <SupportSection>
      <SupportArticleBlock {...view} />
    </SupportSection>
  );
}

/** Compose the active-queue reporting page. */
export function SupportAnalyticsTemplate(view: SupportAnalyticsView) {
  return (
    <SupportSection page="analytics">
      <SupportAnalyticsBlock {...view} />
    </SupportSection>
  );
}

/** Compose the ticket creation page. */
export function SupportNewTicketTemplate(view: SupportFormView) {
  return (
    <SupportSection page="newTicket">
      <SupportFormBlock {...view} />
    </SupportSection>
  );
}

/** Compose the article creation page. */
export function SupportNewArticleTemplate(view: SupportFormView) {
  return (
    <SupportSection page="newArticle">
      <SupportFormBlock {...view} />
    </SupportSection>
  );
}

/** Compose the article editing page. */
export function SupportEditArticleTemplate(view: SupportFormView) {
  return (
    <SupportSection page="editArticle">
      <SupportFormBlock {...view} />
    </SupportSection>
  );
}

/** Compose a ticket control inside the conversation. */
export function SupportTicketControlTemplate(view: SupportFormView) {
  return <SupportFormBlock {...view} />;
}

/** Render an explicit unavailable state inside the same tenant layout. */
export function SupportUnavailableTemplate({
  page,
  code,
}: {
  page: SupportPageKind;
  code: ActionErrorCode;
}) {
  return (
    <SupportSection page={page}>
      <SupportUnavailableBlock code={code} />
    </SupportSection>
  );
}
