/** Workspace presentation composes owned blocks; route fallbacks import blocks directly. */
import { TenantShell } from "@/components/shells/tenant-shell";
import {
  TenantFrameBlock,
  TenantSidebarBlock,
  TenantHeaderBlock,
  TenantFooterBlock,
  TenantSkipLinkBlock,
} from "@/components/blocks/tenant-blocks";
import type { TenantShellTemplateProps } from "@/types/tenantTypes";
/** Account and navigation slots are prepared by an authenticated feature. */
export function TenantShellTemplate({
  children,
  navigation,
  accountMenu,
}: TenantShellTemplateProps) {
  return (
    <TenantFrameBlock>
      <TenantShell
        navigation={
          <TenantSidebarBlock
            navigation={navigation}
            accountMenu={accountMenu}
          />
        }
        header={<TenantHeaderBlock />}
        footer={<TenantFooterBlock />}
        skipLink={<TenantSkipLinkBlock />}
      >
        {children}
      </TenantShell>
    </TenantFrameBlock>
  );
}
