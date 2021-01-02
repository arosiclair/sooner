<template>
  <transition-height>
    <div class="box paper-bg shadow-sm rounded overflow-hidden" :key="showPreview">
      <input
        v-model="newLink"
        placeholder="Enter a link here"
        type="text"
        class="lg"
        :class="{ error: error }"
        @input="onNewLinkChanged"
        @keyup.enter="addNewLink" />
      <div v-if="showPreview" class="px-3 py-2 text-left">
        <b-spinner v-if="loading" />
        <div v-else class="centered-container split">
          <div class="text-lg">
            {{ titlePreview }}
          </div>
          <div @click="addNewLink" role="button">
            <i class="material-icons actionable">add_circle_outline</i>
          </div>
        </div>
      </div>
    </div>
  </transition-height>
</template>

<script>
import api from '../../modules/api'
import { getDomainFromUrl, debounce } from '../../modules/utilities'
import TransitionHeight from '../utils/TransitionHeight.vue'

export default {
  components: { TransitionHeight },
  data () {
    return {
      newLink: '',
      error: false,
      loading: false,
      metadata: null
    }
  },

  computed: {
    titlePreview () {
      if (this.metadata) {
        return this.metadata.title ? this.metadata.title : 'Title'
      } else {
        return null
      }
    },
    showPreview () {
      return this.titlePreview || this.loading
    }
  },

  methods: {
    onNewLinkChanged: debounce(async function (event) {
      this.loading = true
      this.badLink = false
      this.metadata = await this.getMetadata(this.newLink)
      this.loading = false
    }, 750),

    async addNewLink () {
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
        await api.post('/list/', newLink)
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

      this.$emit('link-added')
    },

    async getMetadata (url) {
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

<style>
.box {
  transition: 300ms ease;
}
</style>
