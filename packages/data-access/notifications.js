const geoffrey = require('./geoffrey')
const flattenObject = require('./utils/flatten-object')

const defaultSubscription = {
  'enabled': false,
  'reminders': {
    'enabled': false,
    'reminderHour': 0,
    'reminderMinute': 0
  }
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

async function addSubscription (userId) {
  await geoffrey.getPushSubcriptions().insertOne({
    ...defaultSubscription,
    userId
  })
  return defaultSubscription
}
