"use server";

import { createPortalDocumentWorkflow } from "../portal/workflows/portalWorkflows";
import { publishDocumentVersionWorkflow } from "../portal/workflows/publish-document-version.workflow";

export async function createPortalDocument(input: unknown) { return createPortalDocumentWorkflow(input); }
export async function addPortalDocumentVersion(input: unknown) { return publishDocumentVersionWorkflow(input); }
