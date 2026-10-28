// Why: shared shapes for the doctrine reads and screens.
export interface DoctrineRule {
  id: string;
  layer: string | null;
  text: string;
  enforcement: string | null;
}

export interface DoctrineLayer {
  id: string;
  rule: string | null;
  why: string | null;
  deny: string[];
}

export interface DoctrineSummary {
  layers: DoctrineLayer[];
  rules: DoctrineRule[];
}
