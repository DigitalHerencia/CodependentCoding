// Why: Types: DTO shapes shared by server and client; no runtime code.
export interface {{Entity}}DTO {
  id: string;
{{dtoFields}}
  version: number;
  updatedAt: string;
}
