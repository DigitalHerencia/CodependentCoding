/**
 * Minimal JSON Schema Validator for Loaded Vibes Framework
 * Implements a subset of JSON Schema Draft 7 to avoid external dependencies.
 *
 * Supported features:
 * - type (string, number, boolean, object, array)
 * - required
 * - properties
 * - items (single schema)
 * - enum
 */

export function validate(data, schema, path = '') {
  const errors = [];

  if (schema.type) {
    const type = Array.isArray(data) ? 'array' : typeof data;
    // Handle null
    if (data === null && schema.type !== 'null') {
      errors.push(`${path}: expected ${schema.type}, got null`);
      return errors;
    }

    if (type !== schema.type && schema.type !== 'any') {
      errors.push(`${path}: expected ${schema.type}, got ${type}`);
      return errors;
    }
  }

  if (schema.required && typeof data === 'object' && data !== null) {
    for (const field of schema.required) {
      if (!(field in data)) {
        errors.push(`${path}: missing required field '${field}'`);
      }
    }
  }

  if (schema.properties && typeof data === 'object' && data !== null) {
    for (const key in schema.properties) {
      if (key in data) {
        const fieldErrors = validate(
          data[key],
          schema.properties[key],
          path ? `${path}.${key}` : key
        );
        errors.push(...fieldErrors);
      }
    }
  }

  if (schema.items && Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemErrors = validate(item, schema.items, path ? `${path}[${index}]` : `[${index}]`);
      errors.push(...itemErrors);
    });
  }

  if (schema.enum && !schema.enum.includes(data)) {
    errors.push(`${path}: value '${data}' is not in enum [${schema.enum.join(', ')}]`);
  }

  return errors;
}

export function validateSpec(data, schemaType) {
  // Load schema based on type (prd or tech)
  // In a real environment, we might need to read the file.
  // For this implementation, we assume the schema is passed or loaded by the caller.
  // But to be self-contained, we can try to require it if we are in Node.

  // This function is a helper to be used by the parser.
  // The parser will load the schema JSON and pass it here.
  return validate(data, schemaType);
}
