<template>
  <div class="position-relative">
    <div id="username-container" @click="toggleOpen" class="mb-2">
      {{ username }}
      <b-avatar class="m-1" />
    </div>
    <div id="dd-container" class="rounded text-center paper-bg shadow" :class="dropdownClass">
      <div>Settings</div>
      <div>Logout</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'UserMenu',
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
}

#dd-container > div {
  font-size: 1.2rem;
  cursor: pointer;
  padding: 1rem 3rem;
}

#dd-container > div:not(:last-child) {
  /* margin-bottom: 0.5rem; */
}
</style>
