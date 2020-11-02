<template>
  <div class="position-relative">
    <div id="username-container" @click="toggleOpen" class="mb-2">
      {{ username }}
      <b-avatar class="m-1" />
    </div>
    <div id="dd-container" class="rounded text-center paper-bg shadow" :class="dropdownClass">
      <HoverOverlay class="dd-item">
        Settings
      </HoverOverlay>
      <HoverOverlay class="dd-item" @click="dispatchLogout">
        Logout
      </HoverOverlay>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HoverOverlay from './utils/HoverOverlay'

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
      username: 'user/userName'
    })
  },
  methods: {
    toggleOpen () {
      this.open = !this.open

      // handle outside clicks when open
      if (this.open) {
        const outsideClick = (event) => {
          if (!event.target.closest('#dd-container')) {
            this.open = false
            document.removeEventListener('click', outsideClick)
          }
        }
        setTimeout(() => document.addEventListener('click', outsideClick))
      }
    },
    ...mapActions({
      dispatchLogout: 'user/logout'
    })
  }
}
</script>

<style scoped>
#username-container {
  font-family: 'Rubik', sans-serif;
  font-size: 24px;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

#dd-container {
  position: absolute;
  right: 0;
  transition: opacity 200ms ease-in-out, top 200ms ease-in-out;
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
  font-size: 1.2rem;
  cursor: pointer;
  padding: 1rem 3rem;
}
</style>
