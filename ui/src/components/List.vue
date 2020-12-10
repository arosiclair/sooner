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

      var result = await api.get('/list/')
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
      if (!url || url.length <= 0) {
        this.error = true
        return
      } else {
        this.error = false
      }

      if (!this.metadata) {
        this.metadata = await this.getMetadata(url)
      }

      var title = this.metadata.title ? this.metadata.title : 'Title'
      var siteName = this.metadata['og:site_name'] ? this.metadata['og:site_name'] : getDomainFromUrl(this.newLink)

      var newLink = {
        linkName: title,
        siteName: siteName,
        link: url
      }

      try {
        var response = await api.put('/list/', newLink)
      } catch (error) {
        this.$toast.error('There was an issue adding your link')
        this.error = true
      }

      if (response.data.result === 'success') {
        this.refresh()
        this.newLink = ''
        this.error = null
        this.metadata = null
      } else {
        this.$toast.error('There was an issue adding your link')
        this.error = true
      }
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
          this.$toast.error('There was an issue getting info on your link')
          return null
        }

        if (response.data.result === 'success') {
          return response.data.metadata
        } else {
          this.error = true
        }
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
