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
    enter (element) {
      element.classList.add('container-transition')
      const { height } = getComputedStyle(element)

      element.style.height = this.prevHeight

      setTimeout(() => {
        element.style.height = height

        setTimeout(() => {
          element.style.height = 'auto'
        }, 300)
      })
    }
  }
}
</script>

<style>
.container-transition {
  transition: 300ms ease;
  overflow: hidden;
}

</style>
