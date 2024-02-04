<template>
  <div>
    <letter-head />
    <h1>Success!</h1>
    <p>{{ message }}</p>
    <router-link :to="{ name: RouteNames.Login }">
      Back to login
    </router-link>
  </div>
</template>

<script>
import { RouteNames } from '../../router'
import LetterHead from '../LetterHead.vue'

export default {
  components: { LetterHead },
  props: {
    message: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      RouteNames
    }
  }
}
</script>
