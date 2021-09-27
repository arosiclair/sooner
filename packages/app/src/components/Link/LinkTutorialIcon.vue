<template>
  <span class="tutorial-icon">
    {{ favicons[0] }}
  </span>
</template>

<script>
export default {
  props: {
    favicons: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped>
.tutorial-icon {
  font-size: 20px;
}
</style>
