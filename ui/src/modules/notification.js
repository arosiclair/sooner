import logoRounded from '../assets/logo-rounded/256.png'
import badge from '../assets/badge/96.png'

export async function showNotification (title, body) {
  if (!('serviceWorker' in navigator)) return false

  const sw = await navigator.serviceWorker.ready
  if (await requestPermission()) {
    sw.showNotification(title, { body, icon: logoRounded, badge })
    return true
  }
}

export async function requestPermission () {
  if (Notification.permission === 'granted') {
    return true
  } else if (Notification.permission !== 'denied') {
    return await Notification.requestPermission() === 'granted'
  }
}

export async function subscribeForPush () {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false
  }

  if (!await requestPermission()) {
    console.warn('subscribeForPush() - notification permission was denied')
    return
  }

  console.log('Waiting for service worker to ready')
  const sw = await navigator.serviceWorker.ready

  const pushOptions = {
    userVisibleOnly: true,
    applicationServerKey: process.env.VUE_APP_PUSH_PUB_KEY
  }

  const pushSubscription = await sw.pushManager.subscribe(pushOptions)
  return sendPushSubscription(pushSubscription)
}

function sendPushSubscription (pushSub) {
  console.log('Web Push Subscription: ' + JSON.stringify(pushSub))
  return true
}
