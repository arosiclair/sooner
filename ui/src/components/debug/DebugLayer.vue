<template>
  <div id="debug-container" class="p-4">
    <MockLinkBtn v-if="loggedIn" />
  </div>
</template>

<script>
import MockLinkBtn from './MockLinksBtn'
import { mapGetters } from 'vuex'

export default {
  components: {
    MockLinkBtn
  },
  computed: mapGetters({
    loggedIn: 'user/loggedIn'
  })
}
</script>

<style>
#debug-container {
  position: sticky;
  text-align: right;
  bottom: 0;
  right: 0;
}
</style>
