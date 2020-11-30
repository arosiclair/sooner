<template>
  <div class="paper-bg" :class="backgroundStyle">
    <div class="centered-container split item" @click="goToLink">
      <!-- Favicon section -->
      <LinkIcon class="favicon" :linkUrl="data.link" />
      <!-- Text section -->
      <div class="centered-container link-text-container">
        <div class="link-text-container">
          <div class="title" ref="title">{{ data.name }}</div>
          <div class="centered-container split">
            <span class="site-name">{{ data.siteName }}</span>
            <div class="time-left-container">
              <i class="material-icons expiration-icon">schedule</i>
              <span class="time-left-text">{{ timeLeft }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Done section -->
      <div class="text-center">
        <i class="material-icons actionable done-btn" @click="remove">done</i>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../../modules/api'
import { addDays, formatDistance, differenceInDays } from 'date-fns'
import { mapGetters } from 'vuex'
import Dotdotdot from 'dotdotdot-js'
import LinkIcon from './LinkIcon'

export default {
  components: {
    LinkIcon
  },
  props: ['data'],
  data () {
    return {
      dddTitle: null
    }
  },
  mounted () {
    this.dddTitle = new Dotdotdot(this.$refs.title)
  },
  computed: {
    timeLeft: function () {
      const expirationDts = addDays(new Date(this.data.addedOn), this.userPrefs.linkTTL)
      return formatDistance(new Date(), expirationDts)
    },
    backgroundStyle: function () {
      const expirationDts = addDays(new Date(this.data.addedOn), this.userPrefs.linkTTL)
      const ttl = differenceInDays(expirationDts, new Date())

      return {
        'expiration-warn': ttl < 2,
        'expiration-alert': ttl < 1
      }
    },
    ...mapGetters({
      userPrefs: 'user/prefs'
    })
  },
  methods: {
    goToLink: function () {
      var win = window.open(this.data.link, '_blank')
      win.focus()
    },
    remove: async function (event) {
      event.stopPropagation()

      await api.delete(`/list/${this.data._id}`)
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
    width: 100%;
    padding: 1rem 1.5rem;
    margin: 0;

    cursor: pointer;
}
.item:hover {
    background-color: #eeeeee7e;
}

.favicon {
    width: 32px;
    height: 32px;
    /* margin-right: 10px; */
}

.link-text-container {
  overflow: hidden;
  width: 100%;
  margin: 0 10px;
}
.title {
    font-size: 20px;
    line-height: 1.3;
    max-height: 3.9em;
    /* white-space: nowrap;
    text-overflow: ellipsis; */
    overflow: hidden;
}
.site-name {
    font-size: 14px;
    color: #c7c7c7;

    white-space: nowrap;
    text-overflow: ellipsis;
    /* width: 100%; */
    display: block;
    overflow: hidden
}
.done-btn {
  margin-bottom: 5px;
}
.time-left-container {
  display: flex;
  white-space: nowrap;
}
.expiration-icon {
  font-size: 22px;
  margin-right: 5px;
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
.expiration-warn .site-name {
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
.expiration-alert .site-name {
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
