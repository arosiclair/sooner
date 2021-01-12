import { precacheAndRoute } from 'workbox-precaching'

// Ensure your build step is configured to include /offline.html as part of your precache manifest.
precacheAndRoute(self.__WB_MANIFEST)
