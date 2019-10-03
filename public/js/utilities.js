function getDomainFromUrl (url) {
  var a = document.createElement('a')
  a.setAttribute('href', url)
  return a.hostname
}

export { getDomainFromUrl }
