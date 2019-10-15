<template>
  <div>
    <div v-if="error" id="error-div" class="alert alert-danger">
      {{ error }}
    </div>

    <div class="group">
      <div class="link-preview-container" :class="{ hidden: !newLinkPreview && !newLinkLoading }">
        <div v-if="newLinkLoading" class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <div v-else class="link-preview-text centered-container split">
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
        :class="{ error: badLink || error }"
        @input="onNewLinkChanged"
        @keyup.enter="addNewLink" />
    </div>
    <div class="group">
      <Link
        v-for="link in links"
        :key="link._id"
        :data="link"
        @list-updated="refresh" />
    </div>
  </div>
</template>

<script>
import api from '../js/api'
import Link from './Link'
import { getDomainFromUrl, debounce } from '../js/utilities'

export default {
  name: 'List',
  components: {
    Link
  },
  data () {
    return {
      loading: true,
      newLink: '',
      error: '',
      badLink: false,
      links: [],
      metadata: undefined,
      newLinkLoading: false
    }
  },
  computed: {
    newLinkPreview: function () {
      if (this.metadata) {
        return this.metadata.title ? this.metadata.title : 'Title'
      } else {
        return null
      }
    }
  },
  mounted: function () {
    this.refresh()
  },
  methods: {
    refresh: async function () {
      this.loading = true

      var result = await api.get(API_URL + '/list/')
      this.links = result.data.list

      this.loading = false
    },
    addNewLink: async function () {
      if (!this.newLink || this.newLink.length <= 0) {
        this.badLink = true
        return
      } else {
        this.badLink = false
      }

      if (!this.metadata) {
        this.metadata = await this.getMetadata(this.newLink)
      }

      var title = this.metadata.title ? this.metadata.title : 'Title'
      var siteName = this.metadata['og:site_name'] ? this.metadata['og:site_name'] : getDomainFromUrl(this.newLink)

      var newLink = {
        linkName: title,
        siteName: siteName,
        link: this.newLink
      }

      var response = await api.post(API_URL + '/list/add', newLink)
      console.log('Adding link result = ' + response.data.result)
      if (response.data.result === 'success') {
        this.refresh()
        this.newLink = ''
        this.error = null
        this.metadata = null
      } else {
        this.error = 'There was an issue adding your link'
      }
    },
    onNewLinkChanged: debounce(async function (event) {
      this.newLinkLoading = true
      this.metadata = await this.getMetadata(this.newLink)
      this.newLinkLoading = false
    }, 750),
    getMetadata: async function (url) {
      if (url) {
        var response = await api.get(API_URL + '/list/linkMetadata?url=' + url)
        if (response.data.result === 'success') {
          return response.data.metadata
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
  font-size: 20px;
}

.link-preview-container {
  padding: 15px;
  text-align: start;
  background-color: #ffffff
}

.link-preview-text {
  font-family: 'Rubik', sans-serif;
  font-size: 24px;
}

.hidden {
  display: none;
}

.group {
  margin-bottom: 20px;
}

#loginFields {
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
    margin-bottom: 20px;
}
</style>
