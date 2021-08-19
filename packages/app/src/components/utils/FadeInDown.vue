<template>
  <div class="animate__animated animate__fadeInDown" :style="style">
    <slot />
  </div>
</template>

<script>
export default {
  props: [
    'height',
    'duration'
  ],

  data () {
    return {
      style: {
        height: this.height || '50px',
        '--animate-duration': this.duration || '1s'
      }
    }
  }
}
</script>
