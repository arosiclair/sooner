<!--
  This is a copy of ScaleHeightInOut as a transition-group
-->
<template>
  <transition-group
    tag="div"
    :css="false"
    @beforeEnter="beforeEnter"
    @enter="enter"
    @afterEnter="afterEnter"
    @leave="leave"
  >
    <slot />
  </transition-group>
</template>

<script>
export default {
  props: {
    ready: {
      type: Boolean,
      default: true
    },
    duration: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      heights: {}
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
      this.heights[el.id] = getComputedStyle(el).height
      el.style.height = 0

      setTimeout(() => {
        el.style.height = this.heights[el.id]
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
      el.style.height = this.heights[el.id]
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
