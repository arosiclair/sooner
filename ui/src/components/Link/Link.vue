<template>
  <ripple-hover-overlay :light="shouldWarn">
    <div
      class="paper-bg"
      :class="backgroundStyle"
    >
      <div
        class="centered-container split item py-3"
        role="button"
        @click="openLink"
      >
        <!-- Favicon section -->
        <LinkIcon
          class="favicon mx-3"
          :link-url="data.link"
        />
        <!-- Text section -->
        <div class="text-container">
          <div
            ref="title"
            class="title"
          >
            {{ data.name }}
          </div>
          <div class="centered-container split">
            <span class="site-name">{{ data.siteName }}</span>
            <div class="time-left-container">
              <i class="material-icons expiration-icon">schedule</i>
              <span class="time-left-text">{{ timeLeft }}</span>
            </div>
          </div>
        </div>
        <!-- Done section -->
        <div
          class="text-center mx-3"
          role="button"
          @click="remove"
        >
          <i class="material-icons actionable done-btn">done</i>
        </div>
      </div>
    </div>
  </ripple-hover-overlay>
</template>

<script>
import api from '../../modules/api'
import { addDays, formatDistance, differenceInDays } from 'date-fns'
import { mapGetters } from 'vuex'
import Dotdotdot from 'dotdotdot-js'
import LinkIcon from './LinkIcon'
import RippleHoverOverlay from '../utils/RippleHoverOverlay.vue'

export default {
  components: {
    LinkIcon,
    RippleHoverOverlay
  },
  props: ['data'],
  data () {
    return {
      dddTitle: null
    }
  },
  computed: {
    timeLeft: function () {
      if (!this.userPrefs.linkTTL) {
        return '...'
      }

      const expirationDts = addDays(new Date(this.data.addedOn), this.userPrefs.linkTTL)
      return formatDistance(new Date(), expirationDts)
    },
    ttl () {
      if (!this.userPrefs.linkTTL) {
        return null
      }

      const expirationDts = addDays(new Date(this.data.addedOn), this.userPrefs.linkTTL)
      return differenceInDays(expirationDts, new Date())
    },
    shouldWarn () {
      return this.ttl < 2
    },
    shouldAlert () {
      return this.ttl < 1
    },
    backgroundStyle: function () {
      if (this.ttl === null) {
        return {}
      }

      return {
        'expiration-warn': this.shouldWarn,
        'expiration-alert': this.shouldAlert
      }
    },
    ...mapGetters({
      userPrefs: 'user/prefs'
    })
  },
  mounted () {
    this.dddTitle = new Dotdotdot(this.$refs.title)
  },
  methods: {
    openLink: function () {
      setTimeout(() => {
        var win = window.open(this.data.link, '_blank')
        win.focus()
      }, 300)
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
    cursor: pointer;
}

.favicon {
    width: 32px;
    height: 32px;
    /* margin-right: 10px; */
}

.text-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.title {
    line-height: 1.3;
    max-height: 3.9em;
    overflow: hidden;
}
.site-name {
  font-size: 0.9rem;
    color: #c7c7c7;

    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    overflow: hidden
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
  font-size: 0.9rem;
}

.expiration-warn {
  background-color: #ffd54f;
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
