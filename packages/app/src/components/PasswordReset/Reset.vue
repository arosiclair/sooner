<template>
  <div>
    <letter-head />
    <h3 class="mb-4">
      Password Reset
    </h3>
    <b-row align-h="center">
      <b-col
        cols="12"
        sm="6"
      />
    </b-row>
    <password-reqs
      :password="password"
      :error="error"
    />
    <div class="shadow-sm rounded overflow-hidden mb-3">
      <input
        v-model="password"
        type="password"
        placeholder="New password"
        class="lg"
        :class="{ error: error && !validPass }"
        @keyup.enter="submit"
      >
      <input
        v-model="passwordConfirm"
        type="password"
        placeholder="Confirm password"
        class="lg"
        :class="{ error: error && !passwordsMatch }"
        @keyup.enter="submit"
      >
    </div>
    <big-submit-btn
      label="SUBMIT"
      :loading="loading"
      :on-submit="submit"
    />
  </div>
</template>

<script>
import api from '../../modules/api'
import { RouteNames } from '../../router'
import LetterHead from '../LetterHead.vue'
import PasswordReqs from '../PasswordReqs.vue'
import BigSubmitBtn from '../BigSubmitBtn.vue'

export default {
  components: {
    LetterHead,
    PasswordReqs,
    BigSubmitBtn
  },

  data () {
    return {
      password: '',
      passwordConfirm: '',
      error: false,
      loading: false,
      success: false
    }
  },

  computed: {
    validPass () {
      if (this.password.length < 8 || this.password.length > 32) return false

      if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(this.password)) return false

      return true
    },

    passwordsMatch () {
      return this.password === this.passwordConfirm
    }
  },

  methods: {
    async submit () {
      this.error = false

      if (!this.validPass || !this.passwordsMatch) {
        this.error = true
        return
      }

      const data = {
        token: this.$route.query.token,
        password: this.password
      }

      try {
        await api.post('/user/updatePassword', data)
      } catch (error) {
        if (error.response.status === 400) {
          this.$toast.error('This password reset link seems to be bad. Try again.', { timeout: false })
        } else {
          this.$toast.error('There was an issue updating your password. Try again.', { timeout: false })
        }
        return
      }

      this.$router.push({ name: RouteNames.PasswordResetSuccess })
    }
  }
}
</script>
