import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production' || process.env.VUE_APP_DEV_SERVICE_WORKER) {
  register('/service-worker.js', {
    registrationOptions: { scope: './' },
    ready (registration) {
      console.log('Service worker is active.')

      // check for service worker updates every hour
      setInterval(() => {
        registration.update()
      }, 3600000)
    },
    registered (registration) {
      console.log('Service worker has been registered.')
    },
    cached (registration) {
      console.log('Content has been cached for offline use.')
    },
    updatefound (registration) {
      console.log('New content is downloading.')
    },
    updated (registration) {
      console.log('New content is available; please refresh.')
    },
    offline () {
      console.log('No internet connection found. App is running in offline mode.')
    },
    error (error) {
      console.error('Error during service worker registration:', error)
    }
  })
}
