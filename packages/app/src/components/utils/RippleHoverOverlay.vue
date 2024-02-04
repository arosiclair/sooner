<template>
  <ripple-overlay :light="light">
    <hover-overlay
      :light="light"
      v-on="$listeners"
    >
      <slot />
    </hover-overlay>
  </ripple-overlay>
</template>

<script>
import HoverOverlay from './HoverOverlay.vue'
import RippleOverlay from './RippleOverlay.vue'
export default {
  components: { RippleOverlay, HoverOverlay },
  props: {
    light: Boolean
  }
}
</script>
