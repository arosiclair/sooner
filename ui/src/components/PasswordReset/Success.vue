<template>
  <div>
    <letter-head />
    <h1>Success!</h1>
    <p>Your password has been updated.</p>
    <router-link :to="{ name: RouteNames.Login }">Back to login</router-link>
  </div>
</template>

<script>
import { RouteNames } from '../../router'
import LetterHead from '../LetterHead.vue'

export default {
  components: { LetterHead },
  data () {
    return {
      RouteNames
    }
  }
}
</script>
