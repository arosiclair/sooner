const geoffrey = require('./geoffrey')

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

async function addSubscription (userId) {
  await geoffrey.getPushSubcriptions().insertOne({
    ...defaultSubscription,
    userId
  })
  return defaultSubscription
}
