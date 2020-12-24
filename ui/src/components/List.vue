<template>
  <div>
    <div class="shadow-sm rounded overflow-hidden mb-4">
      <div class="link-preview-container" :class="{ hidden: !newLinkPreview && !newLinkLoading }">
        <b-spinner small v-if="newLinkLoading" />
        <div v-else class="centered-container split">
          <div>
            {{ newLinkPreview }}
          </div>
          <div @click="addNewLink">
            <i class="material-icons actionable">add_circle_outline</i>
          </div>
        </div>
      </div>
      <input
        id="new-link-input"
        v-model="newLink"
        placeholder="Enter a link here"
        type="text"
        class="lg"
        :class="{ error: error }"
        @input="onNewLinkChanged"
        @keyup.enter="addNewLink" />
    </div>
    <div class="shadow-sm rounded overflow-hidden">
      <Link
        v-for="link in sortedLinks"
        :key="link._id"
        :data="link"
        @list-updated="refresh" />
    </div>
  </div>
</template>

<script>
import api from '../modules/api'
import Link from './Link/Link'
import { getDomainFromUrl, debounce } from '../modules/utilities'
import { mapGetters } from 'vuex'

export default {
  name: 'List',
  components: {
    Link
  },
  data () {
    return {
      loading: true,
      newLink: '',
      error: false,
      links: [],
      metadata: undefined,
      newLinkLoading: false
    }
  },
  computed: {
    sortedLinks () {
      const result = [...this.links]
      return result.sort((a, b) => {
        if (this.userPrefs.linkOrder === 'desc') {
          return new Date(b.addedOn) - new Date(a.addedOn)
        } else {
          return new Date(a.addedOn) - new Date(b.addedOn)
        }
      })
    },
    newLinkPreview () {
      if (this.metadata) {
        return this.metadata.title ? this.metadata.title : 'Title'
      } else {
        return null
      }
    },
    ...mapGetters({
      userPrefs: 'user/prefs'
    })
  },
  mounted: function () {
    this.refresh()
  },
  methods: {
    refresh: async function () {
      this.loading = true

      try {
        var result = await api.get('/list/')
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.error("Doesn't look like you're logged in")
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
    },
    addNewLink: async function () {
      var url = this.newLink.trim()
      if (!url) {
        this.error = true
        return
      } else {
        this.error = false
      }

      if (!this.metadata) {
        this.metadata = await this.getMetadata(url)
      }

      var title = this.metadata.title || 'Title'
      var siteName = this.metadata['og:site_name'] || getDomainFromUrl(this.newLink)

      var newLink = {
        linkName: title,
        siteName: siteName,
        link: url
      }

      try {
        await api.put('/list/', newLink)
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.error('Your session expired')
        } else {
          this.$toast.error('There was an issue adding your link')
          this.error = true
        }
      }

      this.newLink = ''
      this.error = null
      this.metadata = null
      this.refresh()
    },
    onNewLinkChanged: debounce(async function (event) {
      this.newLinkLoading = true
      this.badLink = false
      this.metadata = await this.getMetadata(this.newLink)
      this.newLinkLoading = false
    }, 750),
    getMetadata: async function (url) {
      if (url) {
        try {
          var response = await api.get('/list/linkMetadata?url=' + url)
        } catch (error) {
          if (error.response.status === 406) {
            this.error = true
          } else {
            this.$toast.error('There was an issue getting info on your link')
          }
          return null
        }

        return response.data.metadata
      }
    }
  }
}
</script>

<style scoped>
#new-link-input {
  border-radius: 5px;
  overflow: hidden;
}

.link-preview-container {
  padding: 15px;
  text-align: start;
  background-color: #ffffff
}

.hidden {
  display: none;
}

.group {
  margin-bottom: 20px;
}
</style>
