<template>
  <div :class="backgroundStyle">
    <div class="centered-container split item" @click="goToLink">
      <div class="centered-container link-text-container">
        <img class="favicon" :src="faviconUrl" alt="" />
        <div class="link-text-container">
          <h3>{{ data.name }}</h3>
          <div class="centered-container split">
            <a :href="data.link">{{ data.siteName }}</a>
            <div class="centered-container">
              <i class="material-icons expiration-icon">schedule</i>
              <span class="time-left-text">{{ timeLeft }}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <i class="material-icons actionable done-btn" @click="remove">done</i>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../modules/api'
import { getDomainFromUrl } from '../modules/utilities'
import currentUser from '../modules/user'
import { addDays, formatDistance, differenceInDays } from 'date-fns'

export default {
  props: ['data'],
  computed: {
    faviconUrl: function () {
      return 'https://favicons.githubusercontent.com/' + getDomainFromUrl(this.data.link)
    },
    timeLeft: function () {
      var expirationDts = addDays(new Date(this.data.addedOn), currentUser.prefs.linkTTL)
      return formatDistance(new Date(), expirationDts)
    },
    backgroundStyle: function () {
      var expirationDts = addDays(new Date(this.data.addedOn), currentUser.prefs.linkTTL)
      var ttl = differenceInDays(expirationDts, new Date())

      return {
        'expiration-warn': ttl < 2,
        'expiration-alert': ttl < 1
      }
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
    font-family: 'Rubik', sans-serif;
    width: 100%;
    padding: 15px;
    margin: 0;

    cursor: pointer;
}
.item:hover {
    background-color: #eeeeee7e;
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
  font-size: 22px;
  margin: 0px 5px;
  padding: 0px;
}
.time-left-text {
  font-size: 16px;
}

.expiration-warn {
  background-color: #ffd54f;
}
.expiration-warn .item:hover {
    background-color: #fafafa5c;
}
.expiration-warn a {
  color: #212121;
}
.expiration-warn .material-icons {
  color: #212121;
}
.expiration-warn .material-icons.actionable:hover {
  color: #ffffff;
    background-color: #2121210f;
}

.expiration-alert {
  background-color: #ef5350;
}
.expiration-alert .item:hover {
    background-color: #fafafa21;
}
.expiration-alert a {
  color: #212121;
}
.expiration-alert .material-icons {
  color: #212121;
}
.expiration-alert .material-icons.actionable:hover {
  color: #ffffff;
    background-color: #2121211a;
}
</style>
