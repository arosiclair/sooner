<template>
  <span>
    <b-icon-check-circle-fill
      v-if="valid"
      key="valid"
    />
    <b-icon-dash-circle-fill
      v-else-if="error"
      key="error"
    />
    <b-icon-circle
      v-else
      key="default"
    />
  </span>
</template>

<script>
export default {
  props: {
    valid: {
      type: Boolean,
      default: false
    },
    error: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
span {
  font-size: 1.2em;
}

.icon-enter-active, .icon-leave-active {
  transition: opacity 500ms;
}
.icon-enter {
  transform: translateX(-100%);
  opacity: 0;
}

.icon-leave-to {
  opacity: 0;
}
</style>
