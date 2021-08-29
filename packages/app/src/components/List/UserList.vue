<template>
  <div>
    <list-header />
    <list-input
      class="mb-3"
      @link-added="refresh"
    />

    <!-- List -->
    <div class="pb-3">
      <div class="shadow-sm rounded overflow-hidden">
        <list-transitions>
          <Link
            v-for="link in sortedLinks"
            :key="link._id"
            :data="link"
            @removed="onLinkRemoved"
          />
        </list-transitions>
      </div>
    </div>

    <!-- Empty placeholder -->
    <fade-in-up v-if="empty">
      <b-container
        fluid
        class="p-0"
      >
        <b-col
          xs="12"
          sm="9"
          class="mx-auto p-0"
        >
          <img
            :src="PlaceHolderIcon"
            class="my-2 placeholder-icon"
          >
        </b-col>
      </b-container>
    </fade-in-up>
    <push-notifications-prompt />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '../../modules/api'
import { RouteNames } from '../../router'
import ListHeader from './ListHeader.vue'
import Link from '../Link/Link'
import FadeInUp from '../utils/FadeInUp.vue'
import ListInput from './ListInput.vue'
import ListTransitions from './ListTransitions.vue'
import PlaceHolderIcon from '@/assets/list-placeholder.svg'
import PushNotificationsPrompt from '../PushNotificationsPrompt.vue'
import AsyncLock from 'async-lock'

const lock = new AsyncLock()

export default {
  name: 'List',
  components: {
    Link,
    ListHeader,
    FadeInUp,
    ListInput,
    ListTransitions,
    PushNotificationsPrompt
  },
  data () {
    return {
      PlaceHolderIcon,
      empty: false,
      error: false,
      links: []
    }
  },
  computed: {
    sortedLinks () {
      if (!this.links || this.empty) {
        return []
      }

      const result = [...this.links]
      return result.sort((a, b) => {
        if (this.userPrefs.linkOrder === 'desc') {
          return new Date(b.addedOn) - new Date(a.addedOn)
        } else {
          return new Date(a.addedOn) - new Date(b.addedOn)
        }
      })
    },
    ...mapGetters({
      userPrefs: 'user/prefs',
      loggedIn: 'user/loggedIn'
    })
  },
  async mounted () {
    await this.refresh()

    // toast if this was a redirect from a share attempt
    this.sharePrompt()
  },
  created () {
    window.addEventListener('focus', this.refresh)
  },
  destroyed () {
    window.removeEventListener('focus', this.refresh)
  },
  methods: {
    refresh () {
      return lock.acquire('refresh', async (done) => {
        try {
          var result = await api.get('/list/')
        } catch (error) {
          if (error.response.status === 401) {
            this.goToLogin()
          } else {
            this.$toast.error('There was an issue getting your links')
          }
          done()
          return
        }

        this.links = result.data.list || []
        if (this.links.length === 0) {
          this.empty = true
        } else {
          this.empty = false
        }

        const numExpired = result.data.numExpired
        if (numExpired) {
          const links = numExpired > 1 ? 'links' : 'link'
          this.$toast.info(`${numExpired} ${links} expired since you last visited`, { timeout: false })
        }

        done()
      })
    },
    onLinkRemoved (linkId, promise) {
      return lock.acquire('refresh', async (done) => {
        const originalLinks = this.links
        this.links = this.links.filter(link => link._id !== linkId)

        const { undo } = await promise
        if (undo) {
          this.links = originalLinks
        } else {
          try {
            await api.delete(`/list/${linkId}`)
          } catch (error) {
            this.$toast.error('Sorry, there was an issue removing that link')
            this.links = originalLinks
          }
        }

        done()
      })
    },
    sharePrompt () {
      if (this.$route.query.share) {
        if (this.$route.query.success) {
          this.$toast.info('Shared link successfully added!')
        } else {
          this.$toast.error("Sorry, we couldn't add the link you tried to share", { timeout: false })
        }
      }
    },
    goToLogin () {
      this.$toast.error("Doesn't look like you're logged in anymore")
      this.$router.push({ name: RouteNames.Login })
    }
  }
}
</script>

<style scoped>
.placeholder-icon {
  width: 100%;
}
</style>
