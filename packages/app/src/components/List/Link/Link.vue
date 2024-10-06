<template>
  <RippleHoverOverlay :light="shouldWarn">
    <div
      class="paper-bg"
      :class="backgroundClasses"
    >
      <a
        class="link-content p-3"
        :class="linkClasses"
        role="button"
        :href="data.url"
        target="_blank"
        rel="noreferrer noopener"
      >
        <!-- Icon -->
        <div class="mt-2 mr-2">
          <LinkIcon
            class="mr-1"
            :favicons="data.favicons"
            :tutorial="data.isTutorial"
          />
        </div>

        <!-- Text section -->
        <div class="text-container mr-2">
          <!-- Title -->
          <div class="title mb-1">
            {{ data.name }}
          </div>

          <!-- Site name -->
          <div class="text-sm mb-1">
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
          class="text-center"
          role="button"
          @click="remove"
        >
          <i class="material-icons actionable done-btn">done</i>
        </div>
      </a>
    </div>
  </RippleHoverOverlay>
</template>

<script>
import { formatDistance, differenceInDays } from 'date-fns'
import LinkIcon from './LinkIcon.vue'
import RippleHoverOverlay from '../../utils/RippleHoverOverlay.vue'
import doneMp3 from '../../../assets/sounds/done.mp3'
import { mapGetters } from 'vuex'
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
    remove: async function (event) {
      if (this.userPrefs.doneSound) {
        doneSound.play()
      }

      this.$emit('removed', this.data._id)

      event.stopPropagation()
      event.preventDefault()
    }
  }
}
</script>

<style lang="scss" scoped>
div {
    text-align: start;
}
a:hover {
    text-decoration: none;
}

.link-content {
    cursor: pointer;
    display: flex;
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
  font-size: 18px;
  margin-right: 5px;
  padding: 0px;

  /* Slightly larger font for low-dpi displays for less aliasing */
  @media only screen and (-webkit-max-device-pixel-ratio: 1.5),
  only screen and (max-resolution: 1.5dppx) {
    font-size: 21px;
  }
}
.time-left-text {
  position: relative;
  top: 1px;
}

a {
  color: #212121;

  .material-icons {
    color: #212121;

    @media (prefers-color-scheme: dark) {
      color: #fff;
    }
  }

  @media (prefers-color-scheme: dark) {
    color: #fff;
  }
}

.expiration-warn {
  background-color: #ffd54f;

  .material-icons.actionable:hover {
    color: #ffffff;
    background-color: #2121210f;
  }

  & > a, & .material-icons {
    @media (prefers-color-scheme: dark) {
      color: #212121;
    }
  }
}

.expiration-alert {
  background-color: #ef5350;

  .material-icons.actionable:hover {
    color: #ffffff;
    background-color: #2121211a;
  }

  & > a, & .material-icons {
    @media (prefers-color-scheme: dark) {
      color: #212121;
    }
  }
}
</style>
