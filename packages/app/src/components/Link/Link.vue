<template>
  <RippleHoverOverlay :light="shouldWarn">
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
          class="mx-3"
          :favicons="data.favicons"
        />
        <!-- Text section -->
        <div class="text-container">
          <div class="title">
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
  </RippleHoverOverlay>
</template>

<script>
import { formatDistance, differenceInDays } from 'date-fns'
import LinkIcon from './LinkIcon'
import RippleHoverOverlay from '../utils/RippleHoverOverlay.vue'
import DoneSound from '@/assets/sounds/done.mp3'
import { mapGetters } from 'vuex'
import { delay } from '../../modules/utilities'
import ToastUndoBtn from '../ToastUndoBtn.vue'

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
      return formatDistance(new Date(), new Date(this.data.expiresOn))
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
  methods: {
    openLink: async function () {
      await delay(300)

      var win = window.open(this.data.url, '_blank')
      win.focus()
    },
    remove: async function (event) {
      if (this.userPrefs.doneSound) {
        new Audio(DoneSound).play()
      }

      event.stopPropagation()

      this.$emit('removed', this.data._id, new Promise((resolve, reject) => {
        let remove = true
        this.$toast.info('Link removed', {
          timeout: 3000,
          pauseOnFocusLoss: false,
          closeButton: ToastUndoBtn,
          closeOnClick: true,
          onClick: () => {
            remove = false
            resolve({ undo: true })
          },
          onClose: () => remove && resolve({ undo: false })
        })
      }))
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

.text-container {
  flex: 1;
  width: 100%;
  overflow: hidden;
}
.title {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
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
