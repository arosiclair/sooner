<template>
  <div class="centered-container justify-content-center p-4">
    <img id="logo" :src="Logo" class="mr-3"/>
    <span class="text-lg">Sooner</span>
  </div>
</template>

<script>
import Logo from '@/assets/logo-rounded.png'
export default {
  data () {
    return {
      Logo
    }
  }
}
</script>

<style scoped>
#logo {
  width: 50px;
}
</style>
