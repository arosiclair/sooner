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
        this.$router.push({ name: RouteNames.Adding })
      } catch (error) {
        this.$router.push({ name: RouteNames.Login })
      }
    }
  }
}
</script>

<style>

</style>
