"use server";

import { addPortalDocumentVersionWorkflow, createPortalDocumentWorkflow } from "../portal/workflows/portalWorkflows";

export async function createPortalDocument(input: unknown) { return createPortalDocumentWorkflow(input); }
export async function addPortalDocumentVersion(input: unknown) { return addPortalDocumentVersionWorkflow(input); }
