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
    <div id="list-container">
      <h2>Links:</h2>
      <li v-for="link in links" :key="link._id">
        {{ link.link }}
      </li>
    </div>
  </div>
</template>

<script>
import api from '../js/api'

export default {
  name: 'List',
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
    this.refreshLinks()
  },
  methods: {
    refreshLinks: async function () {
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

      var newLink = {
        linkName: 'New link name',
        link: this.newLink
      }

      var response = await api.post(API_URL + '/list/add', newLink)
      console.log('Adding link result = ' + response.data.result)
      if (response.data.result === 'success') {
        this.refreshLinks()
        this.newLink = ''
        this.error = null
      } else {
        this.error = 'There was an issue adding your link'
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
</style>
