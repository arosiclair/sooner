<template>
  <transition-group
    name="list-complete"
    tag="div"
    @after-enter="afterEnter">
    <slot />
  </transition-group>
</template>

<script>
export default {
  props: [
    'ready'
  ],
  methods: {
    afterEnter (element) {
      element.classList.add('list-transition')
      const fullHeight = getComputedStyle(element).height

      if (this.ready) {
        element.style.height = 0
      }

      setTimeout(() => {
        element.style.height = fullHeight
      })
    }
  }
}
</script>

<style>
.list-transition {
  transition: 300ms ease;
  overflow: hidden;
}
.list-complete-enter {
  opacity: 0;
}
.list-complete-leave-to {
  height: 0!important;
}
</style>
