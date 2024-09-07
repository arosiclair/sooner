<template>
  <RippleHoverOverlay :light="shouldWarn">
    <div
      class="paper-bg"
      :class="backgroundClasses"
    >
      <div
        class="link-content py-3"
        :class="linkClasses"
        role="button"
        @click="openLink"
      >
        <!-- Text section -->
        <div class="text-container pl-3">
          <!-- Title -->
          <div class="title mb-2">
            {{ data.name }}
          </div>

          <!-- Site name -->
          <div class="text-sm mb-2">
            <LinkIcon
              class="mr-1 link-icon"
              :favicons="data.favicons"
              :tutorial="data.isTutorial"
            />
            <span class="site-name">{{ data.siteName }}</span>
          </div>

          <!-- Time left -->
          <div class="time-left-container text-sm">
            <i class="material-icons expiration-icon">schedule</i>
            <span class="time-left-text">{{ timeLeft }}</span>
          </div>
        </div>

        <!-- Done button -->
        <div
          class="text-center mx-3"
          role="button"
          @click="remove"
        >
          <i class="material-icons actionable done-btn">done</i>
        </div>
      </div>
    </div>
  </RippleHoverOverlay>
</template>

<script>
import { formatDistance, differenceInDays } from 'date-fns'
import LinkIcon from './LinkIcon'
import RippleHoverOverlay from '../utils/RippleHoverOverlay.vue'
import doneMp3 from '@/assets/sounds/done.mp3'
import { mapGetters } from 'vuex'
import { delay } from '../../modules/utilities'
import { Howl } from 'howler'

const doneSound = new Howl({
  src: [doneMp3]
})

export default {
  components: {
    LinkIcon,
    RippleHoverOverlay
  },
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dddTitle: null
    }
  },
  computed: {
    timeLeft () {
      return formatDistance(new Date(), new Date(this.data.expiresOn)) + ' left'
    },
    ttl () {
      return differenceInDays(new Date(this.data.expiresOn), new Date())
    },
    shouldWarn () {
      return this.ttl < 2
    },
    shouldAlert () {
      return this.ttl < 1
    },
    backgroundClasses: function () {
      if (this.ttl === null) {
        return {}
      }

      return {
        'expiration-warn': this.shouldWarn,
        'expiration-alert': this.shouldAlert
      }
    },
    linkClasses () {
      return {
        tutorial: this.data.isTutorial
      }
    },
    ...mapGetters({
      userPrefs: 'user/prefs'
    })
  },
  methods: {
    openLink: async function () {
      await delay(300)

      const win = window.open(this.data.url, '_blank')
      win.focus()
    },
    remove: async function (event) {
      if (this.userPrefs.doneSound) {
        doneSound.play()
      }

      this.$emit('removed', this.data._id)
      event.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
div {
    text-align: start;
}

.link-content {
    cursor: pointer;
    display: flex;
}

.link-icon {
  align-self: flex-start;
}

.text-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  font-weight: 500;
  overflow: hidden;
}

.tutorial {
  .title {
    -webkit-line-clamp: initial;
  }
}

.meta-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.site-name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden
}
.time-left-container {
  display: flex;
  align-items: center;
  white-space: nowrap;
}
.expiration-icon {
  color: inherit;
  font-size: 21px;
  margin-right: 5px;
  padding: 0px;
}
.time-left-text {
  position: relative;
  top: 1px;
}

.expiration-warn {
  background-color: #ffd54f;
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
