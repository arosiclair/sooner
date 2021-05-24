const express = require('express')
const router = express.Router()
const { getSubscription, updateSubscription, addDevice, getDevices } = require('@sooner/data-access/push-subscriptions')
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

router.get('/devices', async (req, res, next) => {
  try {
    const devices = await getDevices(req.userId)
    res.json(devices)
  } catch (error) {
    next(error)
  }
})

const pushDeviceValidation = [
  body('type').isString().custom((value) => ['WebPush'].includes(value)),
  body('data').isObject({ strict: true }),
  body('data.endpoint').isString(),
  body('data.expirationTime').isString(),
  body('data.options').isObject(),
  body('data.options.userVisibleOnly').isBoolean({ strict: true }),
  body('data.options.applicationServerKey').isString(),
  validation
]
router.post('/devices', ...pushDeviceValidation, async (req, res, next) => {
  const device = matchedData(req)
  try {
    const result = await addDevice(req.userId, device)
    res.json(result.devices)
  } catch (error) {
    next(error)
  }
})

module.exports = router
