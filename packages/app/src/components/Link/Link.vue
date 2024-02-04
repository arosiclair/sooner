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
        <!-- Favicon section -->
        <LinkIcon
          class="mx-3 mt-2 link-icon"
          :favicons="data.favicons"
          :tutorial="data.isTutorial"
        />
        <!-- Text section -->
        <div class="text-container">
          <div class="title mb-1">
            {{ data.name }}
          </div>
          <div class="meta-container text-sm">
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
import doneMp3 from '@/assets/sounds/done.mp3'
import { mapGetters } from 'vuex'
import { delay } from '../../modules/utilities'
import ToastUndoBtn from '../ToastUndoBtn.vue'
import { Howl } from 'howler'

/**
 * Use a counter for creating unique Ids for undo toast notifications
 * This makes it possible to dismiss the previous undo toast when creating another
 *  */
let undoToastIdCounter = 0
const getUndoToastId = (counter) => `link-remove-undo-toast-${counter}`

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

      event.stopPropagation()

      this.$emit('removed', this.data._id, new Promise((resolve, reject) => {
        let remove = true

        this.$toast.dismiss(getUndoToastId(undoToastIdCounter)) // dismiss the previous undo toast
        this.$toast.info('Link removed', {
          id: getUndoToastId(++undoToastIdCounter),
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
  display: block;
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
