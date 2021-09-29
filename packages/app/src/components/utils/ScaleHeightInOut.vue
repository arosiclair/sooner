<!--
  Smoothly transitions an element  0 <-> full-height when added and removed
-->
<template>
  <transition
    :css="false"
    :appear="appear"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @leave="leave"
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
      fullHeight: 0
    }
  },
  methods: {
    // --------
    // ENTERING
    // --------

    beforeEnter: function (el) {
      el.style.transition = `height ${this.duration}ms ease`
      el.style.overflow = 'hidden'
      el.style.willChange = 'height'
    },
    // the done callback is optional when
    // used in combination with CSS
    enter: function (el, done) {
      this.fullHeight = getComputedStyle(el).height
      console.log(`fullHeight: '${this.fullHeight}'`)
      el.style.height = 0

      setTimeout(() => {
        el.style.height = this.fullHeight
        setTimeout(() => done(), this.duration)
      })
    },
    afterEnter: function (el) {
      el.style.height = 'auto'
    },
    enterCancelled: function (el) {
      // ...
    },

    // --------
    // LEAVING
    // --------

    beforeLeave: function (el) {
      // ...
    },
    // the done callback is optional when
    // used in combination with CSS
    leave: function (el, done) {
      console.log(`fullHeight: ${this.fullHeight}`)
      el.style.height = this.fullHeight
      setTimeout(() => {
        el.style.height = 0
        setTimeout(() => done(), this.duration)
      })
    },
    afterLeave: function (el) {
      // ...
    },
    // leaveCancelled only available with v-show
    leaveCancelled: function (el) {
      // ...
    }
  }
}
</script>

<style scoped>
</style>
