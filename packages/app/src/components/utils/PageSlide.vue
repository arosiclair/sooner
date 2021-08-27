// Courtesy of [Josh Collinsworth](https://css-tricks.com/author/joshcollinsworth/) at css-tricks

<template>
  <transition
    name="page-slide"
    mode="out-in"
  >
    <slot />
  </transition>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
.page-slide {
  &-enter-active {
    transition: all 0.35s cubic-bezier(0, 0.25, 0, 0.75);
  }

  &-leave-active {
    transition: all 0.35s cubic-bezier(0.75, 0, 1, 0.75);
  }

  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateY(1rem);

    .reduce-motion & {
      transform: none !important;
    }
  }

  &-leave-to {
    transform: translateY(-1rem);
  }
}
</style>
