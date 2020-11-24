// removes properties on object that are not defined in the schema
const sanitize = (object, schema) => {
  if (!object || !schema) { return }

  const objKeys = Object.keys(object)
  const schemaKeys = Object.keys(schema)

  for (const key of objKeys) {
    if (!schemaKeys.includes(key)) {
      delete object[key]
    }
  }

  return object
}

/*
    Validates that each property on object that is contained in schema passes
    the schema's test.
    Returns an array of keys that failed their test
*/
const validate = (object, schema) => Object
  .keys(schema)
  .filter(key => object[key] && !schema[key](object[key]))
  .map(key => key)

/*
    Validates that the object contains all properties in the schema and passes
    each test.
    Returns an array of keys that failed their test or are not present
*/
const validateStrict = (object, schema) => Object
  .keys(schema)
  .filter(key => !schema[key](object[key]))
  .map(key => key)

const sanitizeAndValidate = (object, schema) => {
  sanitize(object, schema)
  return validate(object, schema)
}

module.exports = {
  sanitize,
  validate,
  validateStrict,
  sanitizeAndValidate
}
