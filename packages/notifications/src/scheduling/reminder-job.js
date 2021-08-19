const { getSubscription } = require('@sooner/data-access/push-subscriptions')
const webPush = require('../web-push')
const getExpiringLinks = require('../get-expiring-links')

const REMINDER_JOB = 'send expiration reminder'
module.exports.REMINDER_JOB = REMINDER_JOB

module.exports.defineReminderJob = (agenda) => {
  agenda.define(REMINDER_JOB, async (job) => {
    const { userId } = job.attrs.data
    const subscription = await getSubscription(userId)

    // check if this user still wants notifications and reminders
    if (!subscription.enabled || !subscription.reminders.enabled) return

    const soonExpiringLinks = await getExpiringLinks(userId)
    const notification = {
      title: soonExpiringLinks.length > 1
        ? `You have ${soonExpiringLinks.length} links expiring soon`
        : 'One of your links will expire soon',
      body: soonExpiringLinks.slice(0, 3).map(link => link.name).join('\n')
    }

    webPush(userId, subscription, Buffer.from(JSON.stringify(notification)))
  })
}

module.exports.scheduleReminderJob = async (agenda, userId, hour, minute) => {
  // cancel the previously existing job
  await agenda.cancel({
    name: REMINDER_JOB,
    data: { userId }
  })

  const job = agenda.create(REMINDER_JOB, { userId })
  job.repeatEvery(`${minute} ${hour} * * *`)
  job.save()
}
