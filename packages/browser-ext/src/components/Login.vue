<template>
  <div class="text-center">
    <LetterHead />
    <b-alert
      :show="showErrorMsg"
      variant="danger"
    >
      {{ errorMsg }}
    </b-alert>
    <form class="mb-3">
      <div class="paper-bg shadow-sm rounded overflow-hidden mb-3">
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="lg"
          :class="{ error: error && !validEmail }"
          @keyup.enter="submit"
        >
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="lg"
          :class="{ error: error && !validPass }"
          @keyup.enter="submit"
        >
      </div>
      <button
        class="shadow-sm rounded p-3"
        type="button"
        :disabled="loading"
        @click="submit"
      >
        <b-spinner v-if="loading" />
        <span v-else>Login</span>
      </button>
    </form>
    <a
      href="https://sooner.app"
      target="_blank"
      rel="noopener noreferrer"
    >Don't have an account?</a>
  </div>
</template>

<script>
import { login } from '../api'
import LetterHead from '../components/LetterHead.vue'
import { hasReadIntro } from '../libs/has-read-intro'
import { RouteNames } from '../popup/router'
import browser from 'webextension-polyfill'

export default {
  components: { LetterHead },
  data () {
    return {
      email: '',
      password: '',
      error: false,
      errorMsg: '',
      loading: false
    }
  },
  computed: {
    validEmail () {
      return this.email.length > 0
    },
    validPass () {
      return this.password.length > 0
    },
    showErrorMsg () {
      return !!this.errorMsg
    }
  },
  methods: {
    async submit () {
      this.error = false
      if (!this.validEmail || !this.validPass) {
        this.error = true
        return
      }

      this.loading = true

      try {
        await login(this.email, this.password)
        browser.runtime.sendMessage('logged-in')

        if (await hasReadIntro()) {
          this.$router.push({ name: RouteNames.Adding })
        } else {
          this.$router.push({ name: RouteNames.Intro })
        }
      } catch (error) {
        this.error = true
        if (error.response && error.response.status === 401) {
          this.errorMsg = 'The email/password is incorrect'
        } else {
          console.error(error)
          this.errorMsg = 'Something went wrong. Try again'
        }
      }

      this.loading = false
    }
  }
}
</script>

<style scoped>
input {
  width: 100%;
  padding: 0.8rem;
  margin: 0;

  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid #ffffff;

  transition: 300ms ease;
}

input:hover {
    background-color: #eeeeee;
    border-bottom: 1px solid #eeeeee;
}

input:focus {
    outline: none;
    border-bottom: 1px solid #28b5f4;
}

input.error {
    border-bottom: 1px solid #e53635;
}

button {
  width: 100%;
  background-color: #ffffff;
  border: none;
  transition: 0.5s ease;
}
button:focus {
    outline: none;
}
button:hover {
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
</style>../libs/has-read-intro
