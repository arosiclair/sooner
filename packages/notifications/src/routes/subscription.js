const express = require('express')
const mockDevices = require('../mock/devices.json')
const router = express.Router()
const { getSubscription, updateSubscription } = require('@sooner/data-access/notifications')
const { body, matchedData } = require('express-validator')
const validation = require('@sooner/middleware/validation')
const isNumber = require('@sooner/middleware/is-number')

router.get('/', async (req, res, next) => {
  try {
    const pushSub = await getSubscription(req.userId)
    res.json(pushSub)
  } catch (error) {
    next(error)
  }
})

const subUpdateValidation = [
  body('enabled').optional().isBoolean({ strict: true }),
  body('reminders').optional().isObject(),
  body('reminders.enabled').optional().isBoolean({ strict: true }),
  body('reminders.reminderHour').optional().custom(isNumber).isInt({ min: 0, max: 23 }),
  body('reminders.reminderMinute').optional().custom(isNumber).isInt({ min: 0, max: 59 }),
  validation
]
router.patch('/', ...subUpdateValidation, async (req, res, next) => {
  const changes = matchedData(req)
  try {
    const updatedSub = await updateSubscription(req.userId, changes)
    res.json(updatedSub)
  } catch (error) {
    next(error)
  }
})

router.get('/devices', (req, res) => {
  res.json(mockDevices)
})

module.exports = router
