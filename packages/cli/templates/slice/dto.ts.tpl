// Why: DTO mappers: the only place rows become transport-safe objects (dates to ISO strings).
import type { {{Entity}}DTO } from "@/types/{{module}}Types";
import type { {{Entity}}Record } from "@/lib/db/selects/{{module}}.selects";

export function to{{Entity}}DTO(record: {{Entity}}Record): {{Entity}}DTO {
  return {
    id: record.id,
{{dtoMap}}
    version: record.version,
    updatedAt: record.updatedAt.toISOString(),
  };
}
