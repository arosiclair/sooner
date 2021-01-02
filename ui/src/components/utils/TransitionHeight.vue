<template>
  <transition
    :css='false'
    @beforeLeave="beforeLeave"
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
