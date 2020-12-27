
<template>
  <div>
    <letter-head />
    <h3 class="mb-4">Password Reset</h3>
    <form class="mb-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        @keyup.enter="submit"
        class="lg rounded overflow-hidden shadow-sm mb-3"
        :class="{ error: error  }" />
      <big-submit-btn label="SUBMIT" :loading="loading" :onSubmit="submit" />
  </form>
  </div>
</template>

<script>
import Logo from '@/assets/logo-rounded.png'
import LetterHead from '../LetterHead.vue'
import BigSubmitBtn from '../BigSubmitBtn.vue'

export default {
  components: {
    LetterHead,
    BigSubmitBtn
  },

  data () {
    return {
      Logo,
      email: '',
      error: false
    }
  },

  computed: {
    validEmail () {
      // eslint-disable-next-line no-useless-escape
      const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return emailRegEx.test(this.email)
    }
  },

  methods: {
    submit () {
      return true
    }
  }
}
</script>

<style>

</style>
