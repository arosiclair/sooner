<template>
  <div class="container" v-on="$listeners">
    <slot />
    <div class="overlay" :style="backgroundStyle" />
  </div>
</template>

<script>
export default {
  props: {
    light: Boolean
  },
  computed: {
    backgroundStyle () {
      return {
        backgroundColor: this.light ? 'white' : 'gray'
      }
    }
  }
}
</script>

<style scoped>
.container {
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
}
.overlay:hover {
  opacity: 10%
}
</style>
