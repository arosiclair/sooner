<template>
  <div class="d-flex align-items-center justify-content-center p-3">
    <img id="logo" :src="Logo" class="mr-3"/>
    <h2 class="title">Sooner</h2>
  </div>
</template>

<script>
import Logo from '@/assets/logo.png'
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
