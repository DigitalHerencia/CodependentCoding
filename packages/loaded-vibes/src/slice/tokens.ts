import {
  enumName,
  type Field,
  fieldLabel,
  kebab,
  type Names,
  pascal,
  relationName,
} from "./fields";

/** What the slice needs to know about a ref(Model) target. */
export type RefTarget = {
  model: string;
  /** Tenant table: checked by id + organizationId. */
  tenant: boolean;
};

const indent = (lines: string[], spaces: number) =>
  lines.map((line) => `${" ".repeat(spaces)}${line}`).join("\n");

const delegate = (model: string) =>
  model.charAt(0).toLowerCase() + model.slice(1);

function prismaType(field: Field, names: Names): string {
  const optional = field.optional ? "?" : "";
  switch (field.type) {
    case "string":
    case "text":
      return `String${optional}`;
    case "int":
      return `Int${optional}`;
    case "decimal":
      return `Decimal${optional} @db.Decimal(12, 2)`;
    case "boolean":
      return field.optional ? "Boolean?" : "Boolean @default(false)";
    case "datetime":
      return `DateTime${optional} @db.Timestamptz(6)`;
    case "enum":
      return field.optional
        ? `${enumName(names, field)}?`
        : `${enumName(names, field)} @default(${field.values[0]})`;
    case "ref":
      return field.model === "User"
        ? `String${optional}`
        : `String${optional} @db.Uuid`;
  }
}

function zod(field: Field, names: Names): string {
  const base = {
    string: field.optional
      ? "z.string().trim().max(200)"
      : "z.string().trim().min(1).max(200)",
    text: field.optional
      ? "z.string().max(10_000)"
      : "z.string().trim().min(1).max(10_000)",
    int: 'z.preprocess(value=>value === ""?undefined:value,z.coerce.number().int())',
    decimal:
      'z.string().trim().regex(/^-?\\d+(\\.\\d{1,2})?$/, "Enter a number.")',
    boolean: "z.boolean()",
    datetime: "z.coerce.date()",
    enum: `z.enum(${enumName(names, field)})`,
    ref:
      field.model === "User"
        ? "z.string().min(1).max(200)"
        : "z.string().uuid()",
  }[field.type];
  return field.optional
    ? `z.preprocess(value=>value === ""?null:value,${base}.nullable().optional())`
    : base;
}

function tsType(field: Field, names: Names): string {
  const base = {
    string: "string",
    text: "string",
    int: "number",
    decimal: "string",
    boolean: "boolean",
    datetime: "string",
    enum: enumName(names, field),
    ref: "string",
  }[field.type];
  return field.optional ? `${base} | null` : base;
}

function dtoValue(field: Field): string {
  const value = `record.${field.name}`;
  if (field.type === "datetime") {
    return field.optional
      ? `${value}?.toISOString() ?? null`
      : `${value}.toISOString()`;
  }
  if (field.type === "decimal") {
    return field.optional
      ? `${value}?.toString() ?? null`
      : `${value}.toString()`;
  }
  return value;
}

/** How a DTO value is shown in templates. */
function display(field: Field, owner: string): string {
  const value = `${owner}.${field.name}`;
  if (field.type === "boolean") return `{${value} ? copy.yes : copy.no}`;
  if (field.type === "datetime") {
    return field.optional
      ? `{${value}?.slice(0, 16).replace("T", " ") ?? copy.empty}`
      : `{${value}.slice(0, 16).replace("T", " ")}`;
  }
  if (field.type === "enum") {
    return field.optional
      ? `{${value}?.replaceAll("_", " ") ?? copy.empty}`
      : `{${value}.replaceAll("_", " ")}`;
  }
  return field.optional ? `{${value} ?? copy.empty}` : `{${value}}`;
}

function formDefault(field: Field, names: Names): string {
  const value = `${names.entity}?.${field.name}`;
  switch (field.type) {
    case "boolean":
      return `${value} ?? false`;
    case "int":
      return `${value}?.toString() ?? ""`;
    case "datetime":
      return `${value}?.slice(0, 16) ?? ""`;
    case "enum":
      return field.optional
        ? `${value} ?? ""`
        : `${value} ?? "${field.values[0]}"`;
    default:
      return `${value} ?? ""`;
  }
}

function formToInput(field: Field): string {
  const value = `values.${field.name}`;
  if (field.type === "boolean") return value;
  if (field.type === "int") {
    return field.optional
      ? `${value} === "" ? null : Number(${value})`
      : `Number(${value})`;
  }
  return field.optional ? `${value} || null` : value;
}

function formInput(field: Field, names: Names): string[] {
  const id = kebab(names.entity) + "-" + kebab(field.name);
  const key = JSON.stringify(field.name);
  const bind =
    field.type === "boolean"
      ? "name={field.name} ref={field.ref} onBlur={field.onBlur} checked={Boolean(field.value)} onChange={event=>field.onChange(event.target.checked)}"
      : '{...field} value={String(field.value??"")}';
  let control: string;
  if (field.type === "boolean")
    control =
      '<input id="' +
      id +
      '" type="checkbox" ' +
      bind +
      " aria-invalid={fieldState.invalid}/>";
  else if (field.type === "enum")
    control =
      '<select id="' +
      id +
      '" className="control-field" ' +
      bind +
      " aria-invalid={fieldState.invalid}>" +
      (field.optional ? '<option value="">{copy.none}</option>' : "") +
      field.values
        .map(
          (value) =>
            '<option value="' +
            value +
            '">{copy.values[' +
            key +
            "][" +
            JSON.stringify(value) +
            "]}</option>",
        )
        .join("") +
      "</select>";
  else if (field.type === "text")
    control =
      '<textarea id="' +
      id +
      '" className="control-field min-h-36" ' +
      bind +
      " aria-invalid={fieldState.invalid}/>";
  else
    control =
      '<Input id="' +
      id +
      '" type="' +
      (field.type === "datetime"
        ? "datetime-local"
        : field.type === "int" || field.type === "decimal"
          ? "number"
          : "text") +
      '" ' +
      (field.type === "int"
        ? "step={1} "
        : field.type === "decimal"
          ? 'step="0.01" '
          : "") +
      bind +
      " aria-invalid={fieldState.invalid}/>";
  return [
    "<Controller name={" +
      key +
      "} control={control} render={({field,fieldState})=><Field data-invalid={fieldState.invalid}>",
    '<FieldLabel htmlFor="' + id + '">{copy.fields[' + key + "]}</FieldLabel>",
    control,
    "{fieldState.error&&<FieldError>{fieldState.error.message}</FieldError>}</Field>}/>",
  ];
}

function sample(field: Field): { input: string; row: string } {
  switch (field.type) {
    case "string":
    case "text":
      return { input: '"Sample"', row: '"Sample"' };
    case "int":
      return { input: "1", row: "1" };
    case "decimal":
      return { input: '"10.00"', row: '{ toString: () => "10.00" }' };
    case "boolean":
      return { input: "true", row: "true" };
    case "datetime":
      return {
        input: '"2026-01-01T00:00"',
        row: 'new Date("2026-01-01T00:00:00Z")',
      };
    case "enum":
      return { input: `"${field.values[0]}"`, row: `"${field.values[0]}"` };
    case "ref":
      return {
        input: '"00000000-0000-4000-8000-000000000002"',
        row: '"00000000-0000-4000-8000-000000000002"',
      };
  }
}

function refChecks(
  fields: Field[],
  names: Names,
  targets: Map<string, RefTarget>,
) {
  const refs = fields.filter((field) => field.type === "ref");
  if (refs.length === 0) return { call: "", fn: "", mocks: "" };
  const checks = refs.flatMap((field) => {
    const target = targets.get(field.model ?? "") as RefTarget;
    const where = target.tenant
      ? `{ id: input.${field.name}, organizationId }`
      : `{ userId: input.${field.name}, organizationId }`;
    const model = target.tenant ? delegate(target.model) : "membership";
    return [
      "if (",
      `  input.${field.name} &&`,
      `  !(await tx.${model}.findFirst({ where: ${where}, select: { id: true } }))`,
      ")",
      `  throw new ResourceNotFoundError("${fieldLabel(field)}");`,
    ];
  });
  const shape = refs
    .map((field) => `${field.name}?: string | null | undefined`)
    .join("; ");
  const fn = [
    "",
    "/** Referenced rows must belong to this organization. */",
    `async function assert${names.Entity}References(`,
    "  tx: Prisma.TransactionClient,",
    "  organizationId: string,",
    `  input: { ${shape} },`,
    ") {",
    indent(checks, 2),
    "}",
    "",
  ].join("\n");
  const mockModels = new Set(
    refs.map((field) => {
      const target = targets.get(field.model ?? "") as RefTarget;
      return target.tenant ? delegate(target.model) : "membership";
    }),
  );
  return {
    call: `      await assert${names.Entity}References(tx, access.organizationId, input);`,
    fn,
    mocks: indent(
      [...mockModels].map(
        (model) => `${model}: { findFirst: async () => ({ id }) },`,
      ),
      2,
    ),
  };
}

/** Every `{{token}}` the slice templates use. */
export function sliceTokens(
  names: Names,
  fields: Field[],
  targets: Map<string, RefTarget>,
  extra: { icon: string; moduleLabel: string },
): Record<string, string> {
  const refs = fields.filter((field) => field.type === "ref");
  const enums = fields.filter((field) => field.type === "enum");
  const width = Math.max(...fields.map((field) => field.name.length));
  const titleField =
    fields.find((field) => field.type === "string" && !field.optional) ??
    fields.find((field) => field.type === "string");
  const searchable = fields.filter((field) =>
    ["string", "text"].includes(field.type),
  );
  const checks = refChecks(fields, names, targets);
  const summary = fields.filter((field) => field !== titleField).slice(0, 4);

  return {
    ...names,
    entityPath: kebab(names.entity),
    labelLower: names.label.toLowerCase(),
    labelPluralLower: names.labelPlural.toLowerCase(),
    ModuleLabel: extra.moduleLabel,
    icon: extra.icon,
    fieldCount: String(fields.length),
    enums: enums
      .map((field) =>
        [
          `enum ${enumName(names, field)} {`,
          ...field.values.map((value) => `  ${value}`),
          "}",
          "",
        ].join("\n"),
      )
      .join("\n"),
    prismaFields: indent(
      fields.map(
        (field) => `${field.name.padEnd(width)} ${prismaType(field, names)}`,
      ),
      2,
    ),
    prismaRelations: indent(
      refs.map((field) => {
        const relation = relationName(field);
        const optional = field.optional ? "?" : "";
        const onDelete = field.optional ? "SetNull" : "Restrict";
        return `${relation} ${field.model}${optional} @relation("${names.Entity}${pascal(relation)}", fields: [${field.name}], references: [id], onDelete: ${onDelete})`;
      }),
      2,
    ),
    enumTypeImport: enums.length
      ? `import type { ${enums.map((field) => enumName(names, field)).join(", ")} } from "@/generated/prisma/enums";\n`
      : "",
    enumImport:
      enums.length > 0
        ? `import { ${enums.map((field) => enumName(names, field)).join(", ")} } from "@/generated/prisma/enums";\n`
        : "",
    zodFields: indent(
      fields.map((field) => `${field.name}: ${zod(field, names)},`),
      2,
    ),
    dtoFields: indent(
      fields.map((field) => `${field.name}: ${tsType(field, names)};`),
      2,
    ),
    selectFields: indent(
      fields.map((field) => `${field.name}: true,`),
      2,
    ),
    dtoMap: indent(
      fields.map((field) => `${field.name}: ${dtoValue(field)},`),
      4,
    ),
    writeData: indent(
      fields.map((field) =>
        field.optional
          ? `${field.name}: input.${field.name} ?? null,`
          : `${field.name}: input.${field.name},`,
      ),
      10,
    ),
    prismaTypeImport:
      refs.length > 0
        ? 'import type { Prisma } from "@/generated/prisma/client";\n'
        : "",
    errorImports:
      refs.length > 0
        ? "ResourceNotFoundError, staleOrMissing"
        : "staleOrMissing",
    refCheckCall: checks.call,
    refCheckFunction: checks.fn,
    refMocks: checks.mocks,
    titleExpr: titleField
      ? titleField.optional
        ? `${names.entity}.${titleField.name} ?? copy.untitled`
        : `${names.entity}.${titleField.name}`
      : `copy.title + " " + ${names.entity}.id.slice(0, 8)`,
    searchText:
      searchable.length > 0
        ? searchable
            .map((field) =>
              field.optional
                ? `\${${names.entity}.${field.name} ?? ""}`
                : `\${${names.entity}.${field.name}}`,
            )
            .join(" ")
        : `\${${names.entity}.id}`,
    summaryRows: indent(
      summary.flatMap((field) => [
        `<dt>{copy.fields[${JSON.stringify(field.name)}]}</dt>`,
        `<dd>${display(field, names.entity)}</dd>`,
      ]),
      14,
    ),
    detailRows: indent(
      fields.flatMap((field) => [
        `<dt>${fieldLabel(field)}</dt>`,
        `<dd>${display(field, names.entity)}</dd>`,
      ]),
      10,
    ),
    entityCopy: JSON.stringify(
      {
        title: names.labelPlural,
        create: "New " + names.label.toLowerCase(),
        edit: "Edit " + names.label.toLowerCase(),
        save: "Save " + names.label.toLowerCase(),
        saving: "Saving…",
        search: "Search " + names.labelPlural.toLowerCase(),
        emptyList:
          "No matching " +
          names.labelPlural.toLowerCase() +
          ". Create one to get started.",
        failed: "The request could not be completed. Try again.",
        none: "None",
        yes: "Yes",
        no: "No",
        empty: "—",
        details: "Details",
        updated: "Updated",
        all: "All " + names.labelPlural.toLowerCase(),
        untitled: "Untitled " + names.label.toLowerCase(),
        fields: Object.fromEntries(
          fields.map((field) => [field.name, fieldLabel(field)]),
        ),
        values: Object.fromEntries(
          enums.map((field) => [
            field.name,
            Object.fromEntries(
              field.values.map((value) => [
                value,
                pascal(value.toLowerCase().replaceAll("_", " ")),
              ]),
            ),
          ]),
        ),
      },
      null,
      2,
    ),
    formValueTypes: indent(
      fields.map(
        (field) =>
          `${field.name}: ${field.type === "boolean" ? "boolean" : "string"};`,
      ),
      2,
    ),
    formDefaults: indent(
      fields.map((field) => `${field.name}: ${formDefault(field, names)},`),
      6,
    ),
    formToInput: indent(
      fields.map((field) => `${field.name}: ${formToInput(field)},`),
      10,
    ),
    formInputs: indent(
      fields.flatMap((field) => formInput(field, names)),
      6,
    ),
    validInput: `{ ${fields
      .filter((field) => !field.optional)
      .map((field) => `${field.name}: ${sample(field).input}`)
      .join(", ")} }`,
    invalidInput: `{ ${fields[0]?.name ?? "id"}: { invalid: true } }`,
    sampleRow: indent(
      fields.map(
        (field) =>
          `${field.name}: ${field.optional ? "null" : sample(field).row},`,
      ),
      2,
    ),
  };
}

/** Replaces `{{token}}`; an unknown token is a template bug. */
export function render(
  template: string,
  tokens: Readonly<Record<string, string>>,
  file: string,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    const value = tokens[key];
    if (value === undefined)
      throw new Error(`Unknown token {{${key}}} in ${file}.`);
    return value;
  });
}
