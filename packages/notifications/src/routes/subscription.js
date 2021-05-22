const express = require('express')
const mockDevices = require('../mock/devices.json')
const router = express.Router()
const { getSubscription } = require('@sooner/data-access/notifications')

router.get('/', async (req, res, next) => {
  try {
    const pushSub = await getSubscription(req.userId)
    res.json(pushSub)
  } catch (error) {
    next(error)
  }
})

router.get('/devices', (req, res) => {
  res.json(mockDevices)
})

module.exports = router
