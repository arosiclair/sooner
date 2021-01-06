<template>
  <div class="content" v-on="$listeners" @mouseenter="showOverlay" @mouseleave="hideOverlay">
    <slot />
    <div ref="overlay" class="overlay" :class="{ light }" />
  </div>
</template>

<script>
export default {
  props: {
    light: Boolean,
    overlayEl: null
  },
  methods: {
    showOverlay () {
      if (this.$refs.overlay) {
        this.$refs.overlay.style.opacity = 1
      }
    },
    hideOverlay () {
      if (this.$refs.overlay) {
        this.$refs.overlay.style.opacity = 0
      }
    }
  }
}
</script>

<style scoped>
.content {
  position: relative;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  opacity: 0%;
  transition: opacity 200ms ease-in-out;

  background-color: gray;
  background-color: rgba(0, 0, 0, 0.05);
  pointer-events: none;
}
.overlay.light {
  background-color: white;
  background-color: rgba(255, 255, 255, 0.15);
}
.overlay:hover {
  opacity: 10%;
}
</style>
