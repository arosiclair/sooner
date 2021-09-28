<template>
  <transition-group
    name="list-complete"
    tag="div"
    @after-enter="afterEnter"
    @before-leave="beforeLeave"
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
    }
  },
  methods: {
    afterEnter (element) {
      const fullHeight = getComputedStyle(element).height

      element.classList.add('list-transition')
      if (this.ready) {
        element.style.height = 0
      }

      setTimeout(() => {
        element.style.height = fullHeight

        // reset the height back to auto after the transition finishes
        setTimeout(() => {
          element.style.height = 'auto'
        }, 325)
      })
    },
    beforeLeave (element) {
      element.style.height = getComputedStyle(element).height
    }
  }
}
</script>

<style>
.list-transition {
  transition: 300ms ease;
  overflow: hidden;
  will-change: height;
}
.list-complete-enter {
  opacity: 0;
}
.list-complete-leave-to {
  height: 0!important;
}
</style>
