const Agenda = require('agenda')
const { defineReminderJob } = require('./reminder-job')

if (!process.env.MONGODB_URL) throw new Error('MONGODB_URL is not defined')

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URL,
    collection: 'pushJobs'
  },
  processEvery: '1 minutes'
})

/**
 * Gracefully shutdown notification job processing
 */
async function graceful () {
  await agenda.stop()
  process.exit(0)
}
process.on('SIGTERM', graceful)
process.on('SIGINT', graceful)

/**
 * A Promise wrapper for agenda's ready event
 * @returns A promise that resolves when agenda is ready
 */
const ready = (agenda) => new Promise(resolve => agenda.on('ready', resolve))

module.exports.agenda = agenda

/**
 * Starts the scheduling process. This needs to resolve before attempting to schedule jobs.
 * @returns A promise that resolves to the agenda client when ready
 */
module.exports.startAgenda = async () => {
  await ready(agenda)
  await agenda.start()
  return agenda
}

/**
 * Define jobs here
 */
defineReminderJob(agenda)
