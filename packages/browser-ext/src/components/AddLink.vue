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
      currentUrl: '',
      currentTitle: ''
    }
  },
  computed: {
    isValidUrl () {
      if (!this.currentUrl) return false

      const supportedProtocols = ['https:', 'http:']
      const url = document.createElement('a')
      url.href = this.currentUrl
      return supportedProtocols.includes(url.protocol)
    },
    urlDomain () {
      if (!this.currentUrl) return ''

      const url = document.createElement('a')
      url.href = this.currentUrl
      return url.hostname
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
        const result = await addLink(this.currentUrl)
        this.$router.push({ name: RouteNames.AddSuccess, params: { linkId: result.data.linkId } })
      } catch (error) {
        if (error.response?.status === 400) {
          this.$router.push({ name: RouteNames.AddManual, params: { url: this.currentUrl, tabTitle: this.currentTitle, tabDomain: this.urlDomain } })
        } else {
          this.$router.push({ name: RouteNames.AddFailed, params: { message: 'Sorry, there was an issue saving this page' } })
        }
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
      const { url, title } = tabs[0]
      this.currentUrl = url
      this.currentTitle = title
    }
  }
}
</script>
