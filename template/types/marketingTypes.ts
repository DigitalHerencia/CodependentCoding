export interface CampaignDTO {
  id: string;
  name: string;
  description: string | null;
  status: string;
  scheduledAt: string | null;
  startedAt: string | null;
  completedAt: string | null;
  version: number;
  audience: { id: string; name: string } | null;
  stepCount: number;
  createdAt: string;
  updatedAt: string;
}
export interface AudienceDTO {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
