<template>
  <div
    id="debug-container"
    class="p-4"
  >
    <MockNotificationBtn />
    <MockLinkBtn v-if="loggedIn" />
  </div>
</template>

<script>
import MockLinkBtn from './MockLinksBtn.vue'
import { mapGetters } from 'vuex'
import MockNotificationBtn from './MockNotificationBtn.vue'

export default {
  components: {
    MockLinkBtn,
    MockNotificationBtn
  },
  computed: mapGetters({
    loggedIn: 'user/loggedIn'
  })
}
</script>

<style>
#debug-container {
  position: absolute;
  text-align: right;
  bottom: 0;
  right: 0;
}
</style>
