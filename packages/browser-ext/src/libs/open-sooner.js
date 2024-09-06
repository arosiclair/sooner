import browser from 'webextension-polyfill'

export default function openSooner () {
  browser.tabs.create({
    url: 'https://sooner.app/list',
    active: true
  })
}
