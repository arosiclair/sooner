<template>
  <transition-group
    name="list-complete"
    tag="div"
    @enter="enter"
    @after-enter="afterEnter">
    <slot />
  </transition-group>
</template>

<script>
export default {
  props: [
    'ready'
  ],
  data () {
    return {
      container: null,
      height: 0
    }
  },
  methods: {
    enter (element) {
    },
    afterEnter (element) {
      element.classList.add('list-transition')
      this.height = getComputedStyle(element).height

      if (this.ready) {
        element.style.height = 0
      }

      setTimeout(() => {
        element.style.height = this.height
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
