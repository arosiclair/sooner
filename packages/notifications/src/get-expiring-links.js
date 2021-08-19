const { getListByUserId } = require('@sooner/data-access/lists')

module.exports = async (userId) => {
  if (!userId) return null

  const list = await getListByUserId(userId)
  if (!list) return null

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  return list.links.filter(link => link.expiresOn < tomorrow)
}
