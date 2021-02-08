<template>
  <div class="p-3">
    <div class="mb-2">
      <a class="logo-link" href="https://www.sooner.app/list" target="_blank" rel="noopener noreferrer">
        <img :src="Logo" class="logo" />
        Sooner
      </a>
    </div>
    <div class="d-flex justify-content-center align-items-center text-center" v-if="loading">
      <b-spinner class="mr-3" show/>
      <h5 class="mb-0">Saving...</h5>
    </div>
    <div v-else>
      <div v-if="errorMsg" class="d-flex justify-content-center align-items-center">
        <b-icon class="h4 mb-0 mr-3" icon="exclamation-circle-fill" variant="danger" />
        <h5 class="m-0">{{ errorMsg }}</h5>
      </div>
      <div v-else class="d-flex justify-content-center align-items-center">
        <b-icon class="h4 mb-0 mr-3" icon="check-circle-fill" variant="success" />
        <h5 class="mb-0"> Page added!</h5>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/assets/logo.png'
import { addLink } from '../api'

export default {
  data () {
    return {
      loading: true,
      currentUrl: '',
      errorMsg: '',
      Logo
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
    this.loading = true

    try {
      await this.getUrl()
    } catch (error) {
      this.errorMsg = error.message
      return
    }

    if (this.isValidUrl) {
      try {
        await addLink(this.currentUrl)
      } catch (error) {
        this.errorMsg = 'Sorry, there was an issue saving this page'
      }
    } else {
      this.errorMsg = "Sorry, this kind of page isn't supported"
    }

    this.loading = false
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

<style>
.logo {
  width: 25px;
}

.logo-link, .logo-link:hover {
  color: inherit;
  text-decoration: none;
  background-color:  none;
}
</style>
