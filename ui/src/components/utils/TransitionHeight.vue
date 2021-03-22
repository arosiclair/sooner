<template>
  <transition
    :css="false"
    @beforeLeave="beforeLeave"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
  >
    <slot />
  </transition>
</template>

<script>
export default {
  data () {
    return {
      prevHeight: 0
    }
  },
  methods: {
    beforeEnter (element) {
      element.classList.add('height-transition')
    },
    beforeLeave (element) {
      this.prevHeight = getComputedStyle(element).height
    },
    enter (element, done) {
      const { height } = getComputedStyle(element)

      element.style.height = this.prevHeight

      setTimeout(() => {
        element.style.height = height
      })
      // done()
    },
    afterEnter (element) {
      element.style.height = 'auto'
    }
  }
}
</script>

<style scoped>
.height-transition {
  transition: height 300ms ease;
  overflow: hidden;
}
</style>
