<template>
  <div class="ripple-container" @click="createRipple">
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    light: Boolean
  },
  methods: {
    createRipple (event) {
      const button = event.currentTarget
      const currentTargetRect = button.getBoundingClientRect()

      const circle = document.createElement('span')
      const diameter = Math.max(button.clientWidth, button.clientHeight)
      const radius = diameter / 2

      circle.style.width = circle.style.height = `${diameter}px`
      circle.style.left = `${event.clientX - currentTargetRect.left - radius}px`
      circle.style.top = `${event.clientY - currentTargetRect.top - radius}px`
      circle.classList.add('ripple')
      if (this.light) {
        circle.classList.add('light')
      }

      const ripple = button.getElementsByClassName('ripple')[0]

      if (ripple) {
        ripple.remove()
      }

      button.appendChild(circle)
    }
  }
}
</script>

<style>
.ripple-container {
  position: relative;
  overflow: hidden;
}

span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 750ms linear;
  background-color: rgba(0, 0, 0, 0.1);
}
span.ripple.light {
  background-color: rgba(255, 255, 255, 0.3);
}

@keyframes ripple {
  to {
    transform: scale(3);
    opacity: 0;
  }
}
</style>
