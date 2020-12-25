<template>
  <div>
    <div class="centered-container justify-content-center m-4">
      <img id="logo" :src="Logo" class="mr-3"/>
      <span class="text-lg">Read It Now</span>
    </div>
    <h3 class="mb-4">Password Reset</h3>
    <b-row align-h="center">
      <b-col cols="12" sm="6">
      <PasswordRequirements/>
      </b-col>
    </b-row>
    <div class="shadow-sm rounded overflow-hidden mb-3">
      <input
        v-model="password"
        type="password"
        placeholder="New password"
        @keyup.enter="submit"
        class="lg"
        :class="{ error: error && !validPass }" />
      <input
        v-model="passwordConfirm"
        type="password"
        placeholder="Confirm password"
        @keyup.enter="submit"
        class="lg"
        :class="{ error: error && !validPass }" />
    </div>
    <button class="btn-lg text-lg shadow-sm rounded p-3" type="button" @click="submit" :disabled="loading">
        <b-spinner v-if="loading"/>
        <span v-else>
          SUBMIT
        </span>
      </button>
  </div>
</template>

<script>
import Logo from '../assets/logo-rounded.png'
import PasswordRequirements from './PasswordReqs'

export default {
  components: {
    PasswordRequirements
  },

  data () {
    return {
      Logo,
      password: '',
      passwordConfirm: '',
      error: false,
      loading: false
    }
  },

  computed: {
    validPass () {
      return true
    }
  },

  methods: {
    submit () {
      return true
    }
  }
}
</script>

<style scoped>
#logo {
  width: 50px;
}
</style>
