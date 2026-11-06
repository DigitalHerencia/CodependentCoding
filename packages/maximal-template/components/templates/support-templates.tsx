import { DashboardLayout } from "@/components/blocks/shared-blocks";
import {
  SupportAnalyticsContentBlock,
  SupportInboxContentBlock,
  SupportInboxToolbarBlock,
  SupportKnowledgeArticlePageBlock,
  SupportKnowledgeBaseContentBlock,
  SupportKnowledgeBaseToolbarBlock,
  SupportTicketContentBlock,
} from "@/components/blocks/support-page-blocks";
import {
  supportPresentationCopy,
  supportRemainingCopy,
} from "@/content/support";
import type { ComponentProps } from "react";

export function SupportAnalyticsTemplate(
  props: ComponentProps<typeof SupportAnalyticsContentBlock>,
) {
  return (
    <DashboardLayout
      title={supportPresentationCopy.supportQueueAnalysis}
      nav={[]}
    >
      <SupportAnalyticsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SupportInboxTemplate(
  props: ComponentProps<typeof SupportInboxContentBlock>,
) {
  return (
    <DashboardLayout
      title={supportPresentationCopy.supportInbox}
      nav={[]}
      toolbar={<SupportInboxToolbarBlock {...props} />}
    >
      <SupportInboxContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SupportKnowledgeArticleTemplate(
  props: ComponentProps<typeof SupportKnowledgeArticlePageBlock>,
) {
  return <SupportKnowledgeArticlePageBlock {...props} />;
}
export function SupportKnowledgeBaseTemplate(
  props: ComponentProps<typeof SupportKnowledgeBaseContentBlock>,
) {
  return (
    <DashboardLayout
      title={supportPresentationCopy.knowledgeBase}
      nav={[]}
      toolbar={<SupportKnowledgeBaseToolbarBlock {...props} />}
    >
      <SupportKnowledgeBaseContentBlock {...props} />
    </DashboardLayout>
  );
}
export function SupportTicketTemplate(
  props: ComponentProps<typeof SupportTicketContentBlock>,
) {
  const { ticket } = props;
  return (
    <DashboardLayout
      title={supportRemainingCopy.ticketTitle(ticket.number, ticket.subject)}
      nav={[]}
    >
      <SupportTicketContentBlock {...props} />
    </DashboardLayout>
  );
}
