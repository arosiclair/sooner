import geoffrey from './geoffrey'
import passwordHasher from 'password-hash'
import flattenObject from './utils/flatten-object'
import { toObjectId } from './utils/object-id'

function getUserById (userId: string) {
  if (!userId) return null

  try {
    return geoffrey.getUsers().findOne({ _id: toObjectId(userId) })
  } catch (error) {
    console.error(error)
    return null
  }
}

function getUserByEmail (email: string) {
  if (!email) return null

  return geoffrey.getUsers().findOne({ email: email.toLowerCase() })
}

async function getUserbyEmailAndPass (email: string, password: string) {
  if (!email || !password) return null

  const user = await getUserByEmail(email)
  if (user && passwordHasher.verify(password, user.password)) {
    return user
  }
}

async function getUserPrefs (userId: string) {
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
async function addUser (name: string, email: string, password: string, prefs = defaultUserPrefs) {
  const newUser = {
    name,
    email: email.toLowerCase(),
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

async function updateUser (userId: string, changes: Record<string, unknown>) {
  if (!changes) return false

  const updateObj = flattenObject(changes)
  try {
    const result = await geoffrey.getUsers().findOneAndUpdate({ _id: toObjectId(userId) }, { '$set': updateObj }, { returnDocument: 'after' })
    return result
  } catch (error) {
    console.error('updateUser() - ' + error)
    return null
  }
}

function updatePassword (userId: string, newPassword: string) {
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
