module.exports = (urlString) => {
  if (!urlString) return null

  let url
  try {
    url = new URL(urlString)
  } catch {
    return null
  }

  return url.hostname
}
