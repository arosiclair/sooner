const { removeDevice } = require('@sooner/data-access/push-subscriptions')
const webPush = require('web-push')

if (!process.env.VAPID_PUBLIC_KEY) throw new Error('VAPID_PUBLIC_KEY is not defined')
if (!process.env.VAPID_PRIVATE_KEY) throw new Error('VAPID_PRIVATE_KEY is not defined')
if (!process.env.VAPID_EMAIL) throw new Error('VAPID_EMAIL is not defined')

webPush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

module.exports = (userId, subscription, notification) => {
  if (!subscription || !notification) throw new Error('invalid params')

  return Promise.all(subscription.devices.map(device => {
    return webPush.sendNotification(device.data, notification)
      .catch((err) => {
        if (err.statusCode === 404 || err.statusCode === 410) {
          console.log(`userId: '${userId}' subscription deviceId '${device.id}' has expired or is no longer valid`)
          return removeDevice(userId, device.id)
        } else {
          throw err
        }
      })
  }))
}
