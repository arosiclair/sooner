/* eslint-disable no-undef */
db = db.getSiblingDB('geoffrey')

db.createCollection('users')
db.users.createIndex({ 'email': 1 }, { 'unique': true })

db.createCollection('sessions')
db.sessions.createIndex({ 'updatedAt': 1 }, { 'expireAfterSeconds': 432000 })

db.createCollection('resetRequests')
db.resetRequests.createIndex({ 'createdAt': 1 }, { 'expireAfterSeconds': 3600 })
