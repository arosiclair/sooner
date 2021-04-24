import logoRounded from '../assets/logo-rounded/256.png'
import badge from '../assets/badge/96.png'

export async function showNotification (title, body) {
  const sw = await navigator.serviceWorker.ready
  if (await requestPermission()) {
    sw.showNotification(title, { body, icon: logoRounded, badge })
  }
}

async function requestPermission () {
  if (Notification.permission === 'granted') {
    return true
  } else if (Notification.permission !== 'denied') {
    return await Notification.requestPermission() === 'granted'
  }
}
