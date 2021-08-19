<template>
  <b-modal
    v-model="show"
    centered
    title="Notifications"
    header-class="border-bottom-0"
    title-class="title"
    footer-class="border-top-0"
    cancel-title="No, thanks"
    ok-title="Sure"
    @cancel="onCancel"
    @ok="onOk"
  >
    It looks like you've enabled push notifications on other devices. Enable them here as well so
    you never miss your links!

    <template #modal-footer>
      <b-button @click="onCancel">
        No, thanks
      </b-button>

      <b-button
        id="ok-btn"
        variant="primary"
        @click="onOk"
      >
        <b-spinner
          v-if="loading"
          small
        />
        <span v-else>Sure</span>
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters } from 'vuex'
import { subscribeForPush } from '../modules/notification'

const PROMPTED_KEY = 'push-subscription-prompted'

export default {
  data () {
    return {
      show: false,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      userPrefs: 'user/prefs'
    })
  },
  mounted () {
    const havePrompted = localStorage.getItem(PROMPTED_KEY)
    this.show = this.userPrefs.push.enabled && Notification.permission === 'default' && havePrompted !== 'true'
  },
  methods: {
    onCancel () {
      this.show = false
      try {
        localStorage.setItem(PROMPTED_KEY, 'true')
      } catch (error) {
        console.error("couldn't use localStorage")
        console.error(error)
      }
    },
    async onOk () {
      try {
        this.loading = true
        await subscribeForPush()
        this.show = false
      } catch (error) {
        console.error(error)
        this.$toast.error('Sorry, there was an issue subscribing your device for notifications')
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.title {
  font-weight: 900;
}

#ok-btn {
  width: 75px;
}
</style>
