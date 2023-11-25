<template>
  <div>
    <small-header />
    <loading-message message="Checking login..." />
  </div>
</template>

<script>
import { checkLogin } from '../api'
import SmallHeader from '../components/SmallHeader'
import { RouteNames } from '../popup/router'
import LoadingMessage from './LoadingMessage.vue'
import { hasReadIntro } from '../has-read-intro'
import browser from 'webextension-polyfill'

export default {
  components: {
    SmallHeader,
    LoadingMessage
  },
  mounted () {
    this.tryLogin()
  },
  methods: {
    async tryLogin () {
      try {
        await checkLogin()
        browser.runtime.sendMessage('logged-in')

        if (await hasReadIntro()) {
          this.$router.push({ name: RouteNames.Adding })
        } else {
          this.$router.push({ name: RouteNames.Intro })
        }
      } catch (error) {
        this.$router.push({ name: RouteNames.Login })
      }
    }
  }
}
</script>

<style>

</style>
