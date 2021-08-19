import logoRounded from '../assets/logo-rounded/256.png'
import badge from '../assets/badge/96.png'
import notificationsApi from './notifications-api'

export async function showLocalNotificaiton (title, body) {
  if (!('serviceWorker' in navigator)) throw new Error('Service Worker not supported')

  const sw = await navigator.serviceWorker.ready
  showNotification(sw, title, body)
}

export async function showNotification (sw, title, body) {
  if (await requestPermission()) {
    return sw.showNotification(title, { body, icon: logoRounded, badge })
  } else {
    throw new Error('Notification permission not granted')
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

export async function getPushSubscription () {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false
  }

  const sw = await navigator.serviceWorker.ready
  return sw.pushManager.getSubscription()
}

function sendPushSubscription (pushSub) {
  console.log('Web Push Subscription: ' + JSON.stringify(pushSub))

  return notificationsApi.post('/subscription/devices', {
    type: 'WebPush',
    data: pushSub
  })
}

export async function sendDebugNotification (title, body) {
  console.log('sendDebugNotification()')
  const subscription = {
    devices: [
      {
        type: 'WebPush',
        data: await getPushSubscription()
      }
    ]
  }

  notificationsApi.post('/subscription/test', {
    subscription: subscription,
    notification: {
      title,
      body
    }
  })
}
