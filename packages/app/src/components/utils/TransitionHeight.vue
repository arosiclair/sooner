<!--
  Component for smoothly transitioning the height of a container element between re-renders
-->
<template>
  <transition
    :css="false"
    :appear="appear"
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
  props: {
    appear: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      prevHeight: 0
    }
  },
  methods: {
    beforeEnter (el) {
      el.style.transition = `height ${this.duration}ms ease`
      el.style.overflow = 'hidden'
      el.style.willChange = 'height'
    },
    enter (el, done) {
      const nextHeight = getComputedStyle(el).height
      el.style.height = this.prevHeight

      setTimeout(() => {
        el.style.height = nextHeight
        setTimeout(() => done(), this.duration)
      })
    },
    afterEnter (el) {
      el.style.height = 'auto'
    },
    beforeLeave (el) {
      this.prevHeight = getComputedStyle(el).height
    }
  }
}
</script>
