/** Shared loading and error presentation used by multiple domains. */
import {
  WorkspaceLoadingState,
  FormLoadingState,
  PageLoadingState,
} from "@/components/blocks/shared-blocks";
import type { ComponentProps } from "react";
import { GenericErrorPage } from "@/components/blocks/shared-blocks.client";

export function WorkspaceLoadingTemplate(
  props: ComponentProps<typeof WorkspaceLoadingState>,
) {
  return <WorkspaceLoadingState {...props} />;
}
export function FormLoadingTemplate(
  props: ComponentProps<typeof FormLoadingState>,
) {
  return <FormLoadingState {...props} />;
}
export function PageLoadingTemplate(
  props: ComponentProps<typeof PageLoadingState>,
) {
  return <PageLoadingState {...props} />;
}
export function GenericErrorTemplate(
  props: ComponentProps<typeof GenericErrorPage>,
) {
  return <GenericErrorPage {...props} />;
}
