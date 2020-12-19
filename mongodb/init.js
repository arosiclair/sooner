/* eslint-disable no-undef */
db = db.getSiblingDB('geoffrey')

db.users.drop()
db.sessions.drop()

db.createCollection('users')
db.users.createIndex({ 'email': 1 }, { 'unique': true })

db.createCollection('sessions')
db.sessions.createIndex({ 'createdAt': 1 }, { 'expireAfterSeconds': 3600 })

db.createCollection('resetRequests')
db.resetRequests.createIndex({ 'createdAt': 1 }, { 'expireAfterSeconds': 3600 })
