
/**
 * Custom validator for ```express-validator```.
 * Type checks the value to be a number.
 */
module.exports = (value) => typeof value === 'number'
