
<template>
  <div>
    <letter-head />
    <h3 class="mb-4">
      Password Reset
    </h3>
    <div class="mb-4">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="lg rounded overflow-hidden shadow-sm mb-3"
        :class="{ error: error }"
        @keyup.enter="submit"
      >
      <big-submit-btn
        label="SUBMIT"
        :loading="loading"
        :on-submit="submit"
      />
    </div>
  </div>
</template>

<script>
import LetterHead from '../LetterHead.vue'
import BigSubmitBtn from '../BigSubmitBtn.vue'
import api from '../../modules/api'
import { RouteNames } from '../../router'

export default {
  components: {
    LetterHead,
    BigSubmitBtn
  },

  data () {
    return {
      email: '',
      error: false,
      loading: false
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
    async submit () {
      this.error = false

      if (!this.validEmail) {
        this.error = true
        return
      }

      const data = {
        email: this.email
      }

      try {
        await api.post('/user/resetPassword', data)
      } catch (error) {
        this.$toast.error("Couldn't reset the password for this user")
        return
      }

      this.$router.push({ name: RouteNames.ResetRequestSuccess })
    }
  }
}
</script>

<style>

</style>
