/* eslint-disable no-undef */
conn = new Mongo()
db = conn.getDB('geoffrey')

db.users.drop()
db.sessions.drop()

db.createCollection('users')
db.users.createIndex({ 'email': 1 }, { 'unique': true })

db.createCollection('sessions')
db.sessions.createIndex({ 'createdAt': 1 }, { 'expireAfterSeconds': 3600 })
