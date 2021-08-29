<template>
  <transition
    name="fade-in-up"
    appear
  >
    <div>
      <slot />
    </div>
  </transition>
</template>

<script>
export default {
}
</script>

<style lang="scss" scoped>
.fade-in-up {
  &-enter-active {
    transition: all 1s ease;
  }

  &-enter {
    opacity: 0;
    transform: translateY(100px);

    .reduce-motion & {
      transform: none !important;
    }
  }
}
</style>
