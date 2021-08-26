const geoffrey = require('./geoffrey')
const flattenObject = require('./utils/flatten-object')
const { generateObjectId, toObjectId } = require('./utils/object-id')

const defaultSubscription = {
  enabled: false,
  timezone: '',
  reminders: {
    enabled: false,
    reminderHour: 0,
    reminderMinute: 0
  },
  devices: []
}

/**
 * Gets the push subscription object for the user or creates one if one does not already exist
 * */
module.exports.getSubscription = async (userId) => {
  let pushSub = await geoffrey.getPushSubcriptions().findOne({ userId }, {
    projection: {
      _id: 0,
      userId: 0
    }
  })
  if (!pushSub) {
    pushSub = await addSubscription(userId)
  }
  return pushSub
}

module.exports.updateSubscription = async (userId, changes) => {
  if (!userId || !changes) {
    throw new Error('updateSubscription() - invalid params')
  }

  const updateObj = flattenObject(changes)
  const result = await geoffrey.getPushSubcriptions()
    .findOneAndUpdate(
      { userId },
      { '$set': updateObj },
      {
        returnOriginal: false,
        projection: {
          _id: 0,
          userId: 0
        }
      }
    )
  return result.value
}

module.exports.getDevices = async (userId) => {
  const pushSub = await this.getSubscription(userId)
  return pushSub.devices
}

module.exports.addDevice = async (userId, subscription, device) => {
  if (!userId || !subscription || !device) {
    throw new Error('addDevice() - invalid params')
  }

  // dupe prevention
  const existingDevice = subscription.devices.find(d => equalDevices(device, d))
  if (existingDevice) {
    return subscription
  }

  const newDevice = {
    id: generateObjectId(),
    ...device
  }

  const result = await geoffrey.getPushSubcriptions()
    .findOneAndUpdate(
      { userId },
      { '$push': { devices: newDevice } },
      {
        returnOriginal: false,
        projection: {
          _id: 0,
          userId: 0
        }
      })
  return result.value
}

module.exports.removeDevice = (userId, deviceId) => {
  if (!userId || !deviceId) {
    throw new Error('removeDevice() - invalid params')
  }

  return geoffrey.getPushSubcriptions().updateOne(
    { userId },
    { '$pull': { devices: { id: toObjectId(deviceId) } } },
    {
      returnOriginal: false,
      projection: {
        _id: 0,
        userId: 0
      }
    })
}

async function addSubscription (userId) {
  await geoffrey.getPushSubcriptions().insertOne({
    ...defaultSubscription,
    userId
  })
  return defaultSubscription
}

function equalDevices(device1, device2) {
  if (!device1.type === device2.type) return false

  switch (device1.type) {
    case 'WebPush':
      return device1.data.endpoint === device2.data.endpoint
    default:
      return false
  }
}
