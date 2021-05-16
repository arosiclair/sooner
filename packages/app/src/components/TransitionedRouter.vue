<template>
  <transition
  mode="out-in"
    enter-active-class="animate__animated animate__fadeIn"
    leave-active-class="animate__animated animate__fadeOut">
    <router-view class="router-view"></router-view>
  </transition>
</template>

<script>
export default {

}
</script>

<style scoped>
.router-view {
  --animate-duration: 175ms;
}
</style>
