export type LegalSection = {
  id: string;
  title: string;
  paragraphs: readonly string[];
};

export type LegalDocument = {
  kicker: string;
  title: string;
  subtitle: string;
  updatedAt: string;
  updatedAtDateTime: string;
  introduction: string;
  sections: readonly LegalSection[];
};
