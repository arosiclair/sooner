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
</style>
