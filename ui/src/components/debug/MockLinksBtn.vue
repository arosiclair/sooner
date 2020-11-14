<template>
  <b-btn @click="sendMockData">+ mock links</b-btn>
</template>

<script>
import api from '../../modules/api'
import { subDays } from 'date-fns'
const mockLinks = [
  {
    linkName: 'Arm Macs are a big gamble, and Apple is all in',
    siteName: 'The Verge',
    link: 'https://www.theverge.com/2020/11/9/21556481/apple-new-arm-mac-expectations-preview-one-more-thing-event'
  },
  {
    linkName: 'Welcome to the transition',
    siteName: 'CNN',
    link: 'https://www.cnn.com/2020/11/09/politics/what-matters-november-9/index.html'
  },
  {
    linkName: 'Covid-19 Live Updates: As U.S. Breaks Hospitalization Records, N.Y. and Other States Add Restrictions',
    siteName: 'www.nytimes.com',
    link: 'https://www.nytimes.com/live/2020/11/11/world/covid-19-coronavirus-live-updates?action=click&module=Top%20Stories&pgtype=Homepage'
  },
  {
    linkName: 'The Xbox Series X seems to have a disc drive problem',
    siteName: 'Polygon',
    link: 'https://www.polygon.com/2020/11/11/21560233/xbox-series-x-disk-drive-sounds-inserting-game-issues-microsoft'
  },
  {
    linkName: "YouTube is down, it's not just you",
    siteName: 'Input',
    link: 'https://www.inputmag.com/tech/youtube-is-down-its-not-just-you'
  }
]
export default {
  methods: {
    sendMockData () {
      for (let i = 0; i < mockLinks.length; i++) {
        const link = mockLinks[i]

        link.addedOn = subDays(new Date(), i)
        api.put('/list/', link)
      }
    }
  }
}
</script>

<style>

</style>
