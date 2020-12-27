<template>
  <div>
    <div class="centered-container justify-content-center m-4">
      <img id="logo" :src="Logo" class="mr-3"/>
      <span class="text-lg">Read It Now</span>
    </div>
    <h1>Success!</h1>
    <p>Your password has been updated.</p>
    <router-link :to="{ name: RouteNames.Login }">Back to login</router-link>
  </div>
</template>

<script>
import Logo from '@/assets/logo-rounded.png'
import { RouteNames } from '../../router'

export default {
  data () {
    return {
      Logo,
      RouteNames
    }
  }
}
</script>
