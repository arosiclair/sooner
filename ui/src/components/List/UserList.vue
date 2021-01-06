<template>
  <div>
    <list-header />
    <div class="py-3">
      <list-input class="mb-3" @link-added="refresh" />
      <fade-in-up height='75px' :hidden="empty">
        <div class="shadow-sm rounded overflow-hidden">
          <list-transitions :ready="ready">
            <Link
              v-for="link in sortedLinks"
              :key="link._id"
              :data="link"
              @list-updated="refresh" />
          </list-transitions>
        </div>
      </fade-in-up>
      <fade-in-up v-if="empty">
        <img :src="PlaceHolderIcon" class="my-2 placeholder-icon" />
      </fade-in-up>
    </div>
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

export default {
  name: 'List',
  components: {
    Link,
    ListHeader,
    FadeInUp,
    ListInput,
    ListTransitions
  },
  data () {
    return {
      PlaceHolderIcon,
      ready: false,
      loading: true,
      error: false,
      links: []
    }
  },
  computed: {
    sortedLinks () {
      if (this.empty) {
        return null
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
    empty () {
      return this.links && !this.links.length
    },
    ...mapGetters({
      userPrefs: 'user/prefs',
      loggedIn: 'user/loggedIn'
    })
  },
  async mounted () {
    if (!this.loggedIn) {
      this.$toast.error("Doesn't look like you're logged in anymore")
      this.$router.push({ name: RouteNames.Login })
    } else {
      await this.refresh()

      // prevent the list-transition from animating the initial render with ready flag
      setTimeout(() => {
        this.ready = true
      }, 1000) // render is done an arbitrary amount of time after the first paint
    }
  },
  methods: {
    refresh: async function () {
      this.loading = true

      try {
        var result = await api.get('/list/')
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.error("Doesn't look like you're logged in anymore")
        } else {
          this.$toast.error('There was an issue getting your links')
        }
        return
      }

      this.links = result.data.list

      const numExpired = result.data.numExpired
      if (numExpired) {
        const links = numExpired > 1 ? 'links' : 'link'
        this.$toast.info(`${numExpired} ${links} expired since you last visited`, { timeout: false })
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
.placeholder-icon {
  width: 75%;
}
</style>
