import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { NavigationRoute, registerRoute } from 'workbox-routing'
import { showNotification } from './modules/notification'

// Ensure your build step is configured to include /offline.html as part of your precache manifest.
precacheAndRoute(self.__WB_MANIFEST)

// route all navigation requests to cached index.html page containing the SPA
const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler, {
  denylist: [
    new RegExp('/api/.*')
  ]
})
registerRoute(navigationRoute)

/*
  if user attempts to share with expired session,
  catch 401 response and redirect to list
*/
const shareCb = async ({ url, request, event, params }) => {
  const response = await fetch(request)
  if (response.status === 401) {
    return Response.redirect('/list')
  } else {
    return response
  }
}
registerRoute('/api/list/share', shareCb, 'POST')

self.addEventListener('push', function (event) {
  if (event.data) {
    const data = event.data.json()
    console.log(`Received push event: ${JSON.stringify(data, null, 2)}`)
    event.waitUntil(showNotification(self.registration, data.title, data.body))
  } else {
    console.warn('Received push event with no data.')
  }
})
