import { PortalDocumentControlsBlock } from "@/components/blocks/portal-blocks";
import {
  PortalBillingContentBlock,
  PortalDocumentDetailContentBlock,
  PortalDocumentsContentBlock,
  PortalDocumentsToolbarBlock,
  PortalHomeContentBlock,
} from "@/components/blocks/portal-page-blocks";
import { DashboardLayout } from "@/components/blocks/shared-blocks";
import { portalPresentationCopy } from "@/content/portal";
import type { ComponentProps } from "react";

export function PortalBillingTemplate(
  props: ComponentProps<typeof PortalBillingContentBlock>,
) {
  return (
    <DashboardLayout title={portalPresentationCopy.billingOverview} nav={[]}>
      <PortalBillingContentBlock {...props} />
    </DashboardLayout>
  );
}
export function PortalDocumentDetailTemplate(
  props: ComponentProps<typeof PortalDocumentDetailContentBlock>,
) {
  const { document } = props;
  return (
    <DashboardLayout title={document.title} nav={[]}>
      <PortalDocumentDetailContentBlock {...props} />
    </DashboardLayout>
  );
}
export function PortalDocumentsTemplate(
  props: ComponentProps<typeof PortalDocumentsContentBlock>,
) {
  return (
    <DashboardLayout
      title={portalPresentationCopy.documentVault}
      nav={[]}
      toolbar={<PortalDocumentsToolbarBlock {...props} />}
    >
      <PortalDocumentsContentBlock {...props} />
    </DashboardLayout>
  );
}
export function PortalHomeTemplate(
  props: ComponentProps<typeof PortalHomeContentBlock>,
) {
  return (
    <DashboardLayout title={portalPresentationCopy.clientWorkspace} nav={[]}>
      <PortalHomeContentBlock {...props} />
    </DashboardLayout>
  );
}

export function PortalDocumentControlsTemplate(
  props: ComponentProps<typeof PortalDocumentControlsBlock>,
) {
  return <PortalDocumentControlsBlock {...props} />;
}
