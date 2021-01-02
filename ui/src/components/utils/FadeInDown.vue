<template>
  <div class="animation-container animate__animated animate__fadeInDown">
    <slot />
  </div>
</template>

<style scoped>
.animation-container {
  height: 50px;
  --animate-duration: 1s;
}
</style>
