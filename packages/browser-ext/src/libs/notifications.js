import browser from 'webextension-polyfill'

const basicNotification = {
  type: 'basic',
  iconUrl: '/icons/96.png',
  isClickable: true
}

export const showPageAddedNotification = () => {
  browser.notifications.create({
    title: 'Page added',
    message: 'Page added to your Sooner list',
    ...basicNotification
  })
}

export const showPageAddFailedNotification = () => {
  browser.notifications.create({
    title: "Couldn't add that page",
    message: 'Try using the toolbar button',
    ...basicNotification
  })
}
