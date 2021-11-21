<template>
  <div
    class="content"
    v-on="$listeners"
    @mouseenter="showOverlay"
    @mouseleave="hideOverlay"
  >
    <slot />
    <div
      ref="overlay"
      class="overlay"
      :class="{ light }"
    />
  </div>
</template>

<script>
export default {
  props: {
    light: Boolean
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

<style lang="scss" scoped>
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

  background-color: rgba(0, 0, 0, 0.05);
  pointer-events: none;

  @media (prefers-color-scheme: dark) {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
.overlay.light {
  background-color: rgba(255, 255, 255, 0.15);

  @media (prefers-color-scheme: dark) {
    background-color: rgba(0, 0, 0, 0.075);
  }
}
.overlay:hover {
  opacity: 10%;
}
</style>
