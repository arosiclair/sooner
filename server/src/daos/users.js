var geoffrey = require('../geoffrey')
var passwordHasher = require('password-hash')

async function getUserById (userId) {
  if (!userId) return null

  return geoffrey.getUsers().findOne({ _id: userId })
}

async function getUserByEmail (email) {
  if (!email) return null

  return geoffrey.getUsers().findOne({ email: email })
}

async function getUserbyEmailAndPass (email, password) {
  if (!email || !password) return null

  const user = await getUserByEmail(email)
  if (user && passwordHasher.verify(password, user.password)) {
    return user
  }
}

async function getUserPrefs (userId) {
  const user = await getUserById(userId)
  if (user) {
    return user.prefs
  }
}

async function addUser (name, email, password, prefs) {
  const newUser = {
    name,
    email,
    prefs,
    password: passwordHasher.generate(password, { algorithm: 'SHA256' })
  }

  const result = await geoffrey.getUsers().insertOne(newUser)
  return result.insertedCount === 1
}

async function updateUser (userId, changes) {
  if (!changes) return false

  const updateObj = geoffrey.flattenObject(changes)
  const result = await geoffrey.getUsers().findOneAndUpdate({ _id: userId }, { '$set': updateObj }, { returnOriginal: false })
  return result.value
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUserbyEmailAndPass,
  getUserPrefs,
  addUser,
  updateUser
}
