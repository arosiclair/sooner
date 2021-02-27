<template>
  <div>
    <small-header />
    <loading-message message="Adding page..." />
  </div>
</template>

<script>
import { addLink } from '../api'
import SmallHeader from './SmallHeader.vue'
import { RouteNames } from '../popup/router'
import LoadingMessage from './LoadingMessage.vue'

export default {
  components: { SmallHeader, LoadingMessage },
  data () {
    return {
      currentUrl: ''
    }
  },
  computed: {
    isValidUrl () {
      if (!this.currentUrl) return false

      const supportedProtocols = ['https:', 'http:']
      const url = document.createElement('a')
      url.href = this.currentUrl
      return supportedProtocols.includes(url.protocol)
    }
  },
  async mounted () {
    try {
      await this.getUrl()
    } catch (error) {
      this.$router.push({ name: RouteNames.AddFailed, params: { message: error.message } })
      return
    }

    if (this.isValidUrl) {
      try {
        await addLink(this.currentUrl)
        this.$router.push({ name: RouteNames.AddSuccess })
      } catch (error) {
        this.$router.push({ name: RouteNames.AddFailed, params: { message: 'Sorry, there was an issue saving this page' } })
      }
    } else {
      this.$router.push({ name: RouteNames.AddFailed, params: { message: "Sorry, this kind of page isn't supported" } })
    }
  },
  methods: {
    async getUrl () {
      let tabs
      try {
        tabs = await browser.tabs.query({ currentWindow: true, active: true })
      } catch (error) {
        console.error(error)
        throw new Error('There was an issue getting the current tab')
      }
      console.log(tabs)
      this.currentUrl = tabs[0].url
    }
  }
}
</script>
