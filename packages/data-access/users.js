const geoffrey = require('./geoffrey')
const passwordHasher = require('password-hash')

async function getUserById (userId) {
  if (!userId) return null

  try {
    return geoffrey.getUsers().findOne({ _id: userId })
  } catch (error) {
    console.error(error)
    return null
  }
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

const defaultUserPrefs = {
  linkTTL: 5,
  linkOrder: 'asc',
  doneSound: true
}
async function addUser (name, email, password, prefs = defaultUserPrefs) {
  const newUser = {
    name,
    email,
    prefs,
    password: passwordHasher.generate(password, { algorithm: 'SHA256' })
  }

  try {
    var result = await geoffrey.getUsers().insertOne(newUser)
  } catch (error) {
    return null
  }

  return result.insertedId
}

async function updateUser (userId, changes) {
  if (!changes) return false

  const updateObj = geoffrey.flattenObject(changes)
  try {
    const result = await geoffrey.getUsers().findOneAndUpdate({ _id: userId }, { '$set': updateObj }, { returnOriginal: false })
    return result.value
  } catch (error) {
    console.error('updateUser() - ' + error)
    return null
  }
}

function updatePassword (userId, newPassword) {
  if (!userId || !newPassword) return false

  const hashedPass = passwordHasher.generate(newPassword, { algorithm: 'SHA256' })
  const changes = {
    password: hashedPass
  }
  return updateUser(userId, changes)
}

module.exports = {
  getUserById,
  getUserByEmail,
  getUserbyEmailAndPass,
  getUserPrefs,
  addUser,
  updateUser,
  updatePassword
}
