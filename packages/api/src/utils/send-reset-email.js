if (!process.env.SENDGRID_API_KEY) throw new Error('SENDGRID_API_KEY is not defined')
if (!process.env.SENDGRID_FROM_ADDR) throw new Error('SENDGRID_FROM_ADDR is not defined')

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = async (email, token) => {
  try {
    await sgMail.send({
      to: email,
      from: {
        name: 'Andrew from Sooner',
        email: process.env.SENDGRID_FROM_ADDR
      },
      templateId: 'd-d9611329dac34d49bd561bb57df22fac',
      dynamicTemplateData: { token }
    })
    return true
  } catch (error) {
    console.error(error)

    if (error.response) {
      console.error(error.response.body)
    }

    return false
  }
}
