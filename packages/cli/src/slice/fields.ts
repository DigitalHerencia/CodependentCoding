export type FieldType =
  | "string"
  | "text"
  | "int"
  | "decimal"
  | "boolean"
  | "datetime"
  | "enum"
  | "ref";

export interface Field {
  name: string;
  type: FieldType;
  optional: boolean;
  /** enum(a|b): values as Prisma enum members (UPPER_SNAKE). */
  values: string[];
  /** ref(Model): the target model. */
  model: string | null;
}

const SCALARS = new Set<FieldType>([
  "string",
  "text",
  "int",
  "decimal",
  "boolean",
  "datetime",
]);

/** Columns every slice model already has. */
export const RESERVED_FIELDS = new Set([
  "id",
  "organizationId",
  "organization",
  "version",
  "createdAt",
  "updatedAt",
]);

const NAME = /^[a-z][a-zA-Z0-9]*$/;
const MODEL = /^[A-Z][A-Za-z0-9]*$/;
const ENUM_VALUE = /^[A-Za-z][A-Za-z0-9_ -]*$/;

/** `in progress` / `inProgress` / `in-progress` → `IN_PROGRESS`. */
function enumMember(value: string): string {
  return value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toUpperCase();
}

/**
 * Field DSL (tech-requirements §9):
 * `name:string, amount:decimal?, status:enum(open|won|lost), dueAt:datetime?, ownerId:ref(User)`.
 */
export function parseFields(dsl: string): Field[] {
  const fields: Field[] = [];
  const entries = dsl
    .split(/,(?![^(]*\))/)
    .map((entry) => entry.trim())
    .filter(Boolean);
  if (entries.length === 0) throw new Error("--fields is empty.");

  for (const entry of entries) {
    const match = /^([^:\s]+)\s*:\s*([a-z]+)(?:\(([^)]*)\))?(\?)?$/.exec(entry);
    if (!match) {
      throw new Error(
        `Cannot read field "${entry}". Use name:type, e.g. amount:decimal? or status:enum(a|b).`,
      );
    }
    const [, name = "", rawType = "", argument, optional] = match;
    if (!NAME.test(name)) {
      throw new Error(
        `Field "${name}" must be camelCase (letters and digits).`,
      );
    }
    if (RESERVED_FIELDS.has(name)) {
      throw new Error(`Field "${name}" is reserved; every slice model has it.`);
    }
    if (fields.some((field) => field.name === name)) {
      throw new Error(`Field "${name}" is listed twice.`);
    }
    const type = rawType as FieldType;
    const field: Field = {
      name,
      type,
      optional: optional === "?",
      values: [],
      model: null,
    };
    if (SCALARS.has(type)) {
      if (argument !== undefined) {
        throw new Error(`Type ${type} takes no argument (field "${name}").`);
      }
    } else if (type === "enum") {
      const values = (argument ?? "").split("|").map((value) => value.trim());
      if (
        values.length === 0 ||
        values.some((value) => !ENUM_VALUE.test(value))
      ) {
        throw new Error(
          `enum(...) needs values like enum(draft|sent) (field "${name}").`,
        );
      }
      field.values = [...new Set(values.map(enumMember))];
    } else if (type === "ref") {
      const model = (argument ?? "").trim();
      if (!MODEL.test(model)) {
        throw new Error(
          `ref(...) needs a model like ref(User) (field "${name}").`,
        );
      }
      if (!name.endsWith("Id") || name === "Id") {
        throw new Error(
          `A ref field is named <relation>Id, e.g. ownerId (got "${name}").`,
        );
      }
      field.model = model;
    } else {
      throw new Error(
        `Unknown type "${rawType}" (field "${name}"). Types: string, text, int, decimal, boolean, datetime, enum(a|b), ref(Model).`,
      );
    }
    fields.push(field);
  }
  return fields;
}

export interface Names {
  /** invoice */
  entity: string;
  /** Invoice */
  Entity: string;
  /** invoices */
  entities: string;
  /** Invoices */
  Entities: string;
  /** invoices (URL segment, kebab-case) */
  route: string;
  /** invoiceId (route param) */
  param: string;
  /** "Invoice" / "Invoices" for headings */
  label: string;
  labelPlural: string;
  /** invoicing */
  module: string;
  /** invoicing.invoice (authz resource; permissions are `<resource>:<action>`) */
  resource: string;
  /** Invoicing */
  Module: string;
}

const pascal = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

/** `line-item` / `line_item` / `LineItem` → `lineItem`. */
export function camel(value: string): string {
  const words = value
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());
  return words
    .map((word, index) => (index === 0 ? word : pascal(word)))
    .join("");
}

export function pluralize(word: string): string {
  if (/[^aeiou]y$/.test(word)) return `${word.slice(0, -1)}ies`;
  if (/(s|x|z|ch|sh)$/.test(word)) return `${word}es`;
  return `${word}s`;
}

const kebab = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const words = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase();

export function toNames(
  entityInput: string,
  moduleId: string,
  plural?: string,
): Names {
  const entity = camel(entityInput);
  if (!/^[a-z][a-zA-Z0-9]*$/.test(entity)) {
    throw new Error(
      `Entity "${entityInput}" must be a word like invoice or lineItem.`,
    );
  }
  const entities = plural ? camel(plural) : pluralize(entity);
  if (entities === entity)
    throw new Error("The plural must differ from the entity name.");
  return {
    entity,
    Entity: pascal(entity),
    entities,
    Entities: pascal(entities),
    route: kebab(entities),
    param: `${entity}Id`,
    label: pascal(words(entity)),
    labelPlural: pascal(words(entities)),
    module: moduleId,
    resource: `${moduleId}.${kebab(entity)}`,
    Module: pascal(moduleId),
  };
}

/** `ownerId` → `owner`. */
export const relationName = (field: Field) => field.name.slice(0, -2);

/** Enum type name for an enum field: Invoice + status → InvoiceStatus. */
export const enumName = (names: Names, field: Field) =>
  `${names.Entity}${pascal(field.name)}`;

export const fieldLabel = (field: Field) =>
  pascal(words(field.type === "ref" ? relationName(field) : field.name));

export { pascal };
