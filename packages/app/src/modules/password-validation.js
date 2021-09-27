export function isValidPassword (password) {
  return lengthInRange(password) &&
    containsLower(password) &&
    containsUpper(password) &&
    containsNumber(password) &&
    containsSymbol(password)
}

export const lengthInRange = (password) => password.length >= 8 && password.length <= 32

export const containsLower = (password) => password.toUpperCase() !== password

export const containsUpper = (password) => password.toLowerCase() !== password

export const containsNumber = (password) => /\d/.test(password)

export const containsSymbol = (password) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)
