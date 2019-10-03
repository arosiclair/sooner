<template>
  <div>
    <div v-if="error" id="error-div" class="alert alert-danger">
      {{ error }}
    </div>
    <input
      id="new-link-input"
      v-model="newLink"
      type="text"
      placeholder="Enter a link here"
      :class="{ error: badLink || error }"
      @keyup.enter="addNewLink" />
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
import { getDomainFromUrl } from '../js/utilities'

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
      links: []
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

      var metadata = await this.getMetadata(this.newLink)
      var title = metadata.title ? metadata.title : 'Title'
      var siteName = metadata['og:site_name'] ? metadata['og:site_name'] : getDomainFromUrl(this.newLink)

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
      } else {
        this.error = 'There was an issue adding your link'
      }
    },
    getMetadata: async function (url) {
      var response = await api.get(API_URL + '/list/linkMetadata?url=' + url)
      if (response.data.result === 'success') {
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
  box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
  margin-bottom: 20px;
}

#loginFields {
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
    margin-bottom: 20px;
}
</style>
