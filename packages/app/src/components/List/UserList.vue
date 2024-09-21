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
        <list-transitions :ready="transitionsReady">
          <Link
            v-for="link in sortedLinks"
            :id="`link-${link._id}`"
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
import ToastUndoBtn from '../ToastUndoBtn.vue'

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
      links: [],
      transitionsReady: false,
      previousDeletedLinkId: 0
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
    removeToastID () {
      return `remove-link-${this.removeCounter}`
    },
    ...mapGetters({
      userPrefs: 'user/prefs',
      loggedIn: 'user/loggedIn'
    })
  },
  async mounted () {
    await this.refresh()
    this.showSharedItemNotification()

    // leave list transitions disabled for the initial render than enable afterwards
    setTimeout(() => { this.transitionsReady = true }, 1000)
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
          const result = await api.get('/list/')

          this.links = result.data.list || []
          this.empty = !this.links.length
          this.showExpiredItemsNotification(result.data.numExpired)
        } catch (error) {
          console.error(error)

          if (error.response && error.response.status === 401) {
            this.goToLogin()
          } else {
            this.$toast.error('There was an issue getting your links')
          }
        } finally {
          done()
        }
      })
    },

    onLinkRemoved (linkId) {
      // Optimistically remove the link
      const originalLinks = this.links
      const deletedLink = this.links.find(link => link._id === linkId)
      this.links = this.links.filter(link => link._id !== linkId)

      // Remove any previous toast and show a new one to undo
      this.$toast.dismiss(this.getRemovedToastID(this.previousDeletedLinkId))
      this.previousDeletedLinkId = linkId
      this.$toast.info('Link removed', {
        id: this.getRemovedToastID(linkId),
        timeout: 3000,
        pauseOnFocusLoss: false,
        closeButton: ToastUndoBtn,
        closeOnClick: true,
        onClick: () => this.undoRemoveLink(deletedLink)
      })

      return lock.acquire('refresh', async (done) => {
        // Delete the link
        try {
          await api.delete(`/list/${linkId}`)
        } catch (error) {
          this.$toast.error('Sorry, there was an issue removing that link')
          this.links = originalLinks
        }

        // Release the lock
        done()
      })
    },

    async undoRemoveLink (deletedLink) {
      // Check if this is a dupe
      if (this.links.find(link => link._id === deletedLink._id)) {
        return
      }

      // Optimistically re-add the deleted link
      this.links.push(deletedLink)

      return lock.acquire('refresh', async (done) => {
        // Post the link with it's original addedOn and expiresOn
        try {
          await api.post('/list', {
            linkId: deletedLink._id,
            url: deletedLink.url,
            addedOn: deletedLink.addedOn,
            expiresOn: deletedLink.expiresOn
          })
        } catch {
          this.$toast.error('Sorry, there was an issue restoring that link')
          this.links = this.links.filter(link => link._id !== deletedLink._id)
        }

        // Release the lock
        done()
      })
    },

    showExpiredItemsNotification (numExpired) {
      if (!numExpired) {
        return
      }

      const links = numExpired > 1 ? 'links' : 'link'
      this.$toast.info(`${numExpired} ${links} expired since you last visited`, { timeout: false })
    },

    showSharedItemNotification () {
      if (!this.$route.query.share) {
        return
      }

      if (this.$route.query.success) {
        this.$toast.info('Shared link successfully added!')
      } else {
        this.$toast.error("Sorry, we couldn't add the link you tried to share", { timeout: false })
      }

      // Clear the route query to prevent showing the notification again
      this.$router.push({ query: {} })
    },

    goToLogin () {
      this.$toast.error("Doesn't look like you're logged in anymore")
      this.$router.push({ name: RouteNames.Login })
    },

    getRemovedToastID (linkID) {
      return `toast-link-removed-${linkID}`
    }
  }
}
</script>

<style scoped>
.placeholder-icon {
  width: 100%;
}
</style>
