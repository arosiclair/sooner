const express = require('express')
const mockSubscription = require('../mock/subscription.json')
const mockDevices = require('../mock/devices.json')
const router = express.Router()

router.get('/', (req, res) => {
  res.json(mockSubscription)
})

router.get('/devices', (req, res) => {
  res.json(mockDevices)
})

module.exports = router
