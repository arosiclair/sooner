const express = require('express')
const router = express.Router()
const { getSubscription, updateSubscription, addDevice, getDevices, removeDevice } = require('@sooner/data-access/push-subscriptions')
const { body, matchedData } = require('express-validator')
const validation = require('@sooner/middleware/validation')
const isNumber = require('@sooner/middleware/is-number')
const webPush = require('../web-push')

/**
 * Prefetch the user's subscription data
 * (also creates the subscription if it doesn't exist already)
 */
router.use('/', async (req, res, next) => {
  try {
    req.subscription = await getSubscription(req.userId)
  } catch (error) {
    next(error)
  }
  
  next()
})

router.get('/', (req, res) => res.json(req.subscription))

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

router.get('/devices', (req, res) => res.json(req.subscription.devices))

const pushDeviceValidation = [
  body('type').isString().custom((value) => ['WebPush'].includes(value)),
  body('data').isObject({ strict: true }),
  body('data.endpoint').isString(),
  body('data.expirationTime').optional({ nullable: true }).isString(),
  body('data.options').optional().isObject(),
  body('data.options.userVisibleOnly').optional().isBoolean({ strict: true }),
  body('data.options.applicationServerKey').optional().isString(),
  validation
]
router.post('/devices', ...pushDeviceValidation, async (req, res, next) => {
  const device = matchedData(req)
  try {
    const result = await addDevice(req.userId, req.subscription, device)
    res.json(result.devices)
  } catch (error) {
    next(error)
  }
})

router.delete('/devices/:deviceId', async (req, res, next) => {
  try {
    await removeDevice(req.userId, req.params.deviceId)
    res.send('OK')
  } catch (error) {
    next(error)
  }
})

router.post('/test', async (req, res, next) => {
  if (!process.env.NODE_ENV === 'development') return res.status(404)

  const notifBuffer = Buffer.from(JSON.stringify(req.body.notification))
  webPush(req.body.subscription, notifBuffer)
    .then(result => res.json({ success: true }))
    .catch(err => next(err))
})

module.exports = router
