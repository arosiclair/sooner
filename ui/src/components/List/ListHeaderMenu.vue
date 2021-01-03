<template>
  <div class="position-relative">
    <div id="username-container" class="text-lg" @click="toggleOpen">
      {{ username }}
      <b-avatar class="m-1" />
    </div>
    <div id="dd-container" class="rounded text-center paper-bg shadow-sm" :class="dropdownClass">
      <HoverOverlay class="dd-item text-lg" @click="showSettings">
        Settings
      </HoverOverlay>
      <HoverOverlay class="dd-item text-lg" @click="logout">
        Logout
      </HoverOverlay>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { RouteNames } from '../../router'
import HoverOverlay from '../utils/HoverOverlay'

export default {
  name: 'UserMenu',
  components: {
    HoverOverlay
  },
  data () {
    return {
      open: false
    }
  },
  computed: {
    dropdownClass () {
      return {
        show: this.open,
        hide: !this.open
      }
    },
    ...mapGetters({
      username: 'user/name'
    })
  },
  methods: {
    toggleOpen () {
      this.open = !this.open
      if (this.open) {
        setTimeout(() => document.addEventListener('click', this.outsideClick))
      } else {
        document.removeEventListener('click', this.outsideClick)
      }
    },
    outsideClick (event) {
      if (!event.target.closest('#dd-container')) {
        this.open = false
        document.removeEventListener('click', this.outsideClick)
      }
    },
    showSettings () {
      this.toggleOpen()
      this.$bvModal.show('settings-modal')
    },
    async logout () {
      await this.dispatchLogout()
      this.$router.push({ name: RouteNames.Login })
    },
    ...mapActions({
      dispatchLogout: 'user/logout'
    })
  }
}
</script>

<style scoped>
#username-container {
  cursor: pointer;
  position: relative;
}

#dd-container {
  position: absolute;
  right: 0;
  transition: opacity 200ms ease-in-out, top 200ms ease-in-out;
  z-index: 1;
}

#dd-container.show {
  top: 4em;
  opacity: 1;
}

#dd-container.hide {
  top: 0;
  opacity: 0;
  pointer-events: none;
}

.dd-item {
  cursor: pointer;
  padding: 1rem 3rem;
}
</style>
