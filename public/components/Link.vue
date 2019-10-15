<template>
  <div @click="goToLink" class="centered-container split item">
    <div class="centered-container link-text-container">
      <img class="favicon" :src="faviconUrl" alt="" />
      <div class="link-text-container">
        <h3>{{ data.name }}</h3>
        <div class="centered-container split">
          <a :href="data.link">{{ data.siteName }}</a>
          <div class="centered-container">
            <i class="material-icons expiration-icon">schedule</i>
            <span class="time-left-text">time left</span> 
          </div>
        </div>
      </div>
    </div>
    <div>
      <i class="material-icons actionable done-btn" @click="remove">done</i>
    </div>
  </div>
</template>

<script>
import api from '../js/api'
import { getDomainFromUrl } from '../js/utilities'
import currentUser from '../js/user'

export default {
  props: ['data'],
  computed: {
    faviconUrl: function () {
      return 'https://favicons.githubusercontent.com/' + getDomainFromUrl(this.data.link)
    },
    timeLeft: function () {
      var expirationDts = this.data.addedOn;
    }
  },
  methods: {
    goToLink: function () {
      var win = window.open(this.data.link, '_blank')
      win.focus()
    },
    remove: async function () {
      var data = {
        linkId: this.data._id
      }

      await api.post(API_URL + '/list/remove', data)
      this.$emit('list-updated')
    }
  }
}
</script>

<style scoped>
div {
    text-align: start;
}

.item {
    background-color: #ffffff;
    font-family: 'Rubik', sans-serif;
    width: 100%;
    padding: 15px;
    margin: 0;

    cursor: pointer;
}
.item:hover {
    background-color: #eeeeee;
}

.favicon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
}

.link-text-container {
  overflow: hidden;
  width: 100%;
  margin: 0 10px;
}
h3 {
    font-size: 20px;
    margin-bottom: 0px;

    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    overflow: hidden
}
a {
    font-size: 14px;
    color: #c7c7c7;

    white-space: nowrap;
    text-overflow: ellipsis;
    /* width: 100%; */
    display: block;
    overflow: hidden
}

.expiration-icon {
  font-size: 16px;
  margin: 0px 5px;
  padding: 0px;
}
.time-left-text {
  font-size: 16px;
}
</style>
