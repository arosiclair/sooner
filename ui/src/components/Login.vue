<template>
  <div>
    <img
      class="m-4"
      src="https://via.placeholder.com/150"
      alt="logo" />
    <form>
      <div class="shadow-sm rounded overflow-hidden mb-3">
        <input
          v-if="registering"
          v-model="name"
          class="first"
          type="text"
          placeholder="Name" />
        <input
          v-model="email"
          :class="{ error: error && !validEmail }"
          type="text"
          placeholder="Email"
          @keyup.enter="loginBtnClicked" />
        <input
          v-model="password"
          class="last"
          :class="{ error: error && !validPass }"
          type="password"
          placeholder="Password"
          @keyup.enter="loginBtnClicked" />
      </div>
      <button class="shadow-sm rounded mb-4" id="loginButton" type="button" @click="loginBtnClicked">
        {{ registering ? 'SIGN UP' : 'LOGIN' }}
      </button>
      <a href="#" @click="registering = !registering">
        {{ registering ? 'CANCEL' : 'SIGN UP' }}
      </a>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: ''
    }
  },
  computed: {
    validEmail: function () {
      return this.email.length > 0
    },
    validPass: function () {
      return this.password.length > 0
    }
  },
  methods: {
    loginBtnClicked: function (event) {
      if (this.registering) {
        this.register()
      } else {
        this.login()
      }
    },
    register: async function () {
      const data = {
        name: this.name,
        email: this.email,
        password: this.password
      }
      const result = await this.dispatchRegister(data)
      if (result.error) {
        this.error = result.reason
      }
    },
    login: function () {
      this.error = this.validateLogin()
      if (this.error) {
        this.$toast.error(this.error)
        return
      }

      this.dispatchLogin({ email: this.email, password: this.password })
        .then(result => {
          if (!result.success) {
            this.error = true
            this.$toast.error(result.reason)
          }
        })
    },
    validateLogin: function () {
      if (!this.validEmail) {
        return 'Enter a valid email'
      } else if (!this.validPass) {
        return 'Enter a password'
      } else {
        return null
      }
    },
    ...mapActions({
      dispatchLogin: 'user/login',
      dispatchRegister: 'user/register'
    })
  }
}
</script>

<style scoped>
#loginButton {
    width: 100%;
    height: 66px;
    background-color: #ffffff;
    border: none;

    font-family: 'Rubik', sans-serif;
    font-size: 24px;
    color: #212121;

    transition: 0.5s ease;
}
#loginButton:focus {
    outline: none;
}
#loginButton:hover {
  /* Bootstrap shadow class */
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
}
</style>

<style>
input{
    width: 100%;
    font-size: 24px;
    font-family: 'Rubik', sans-serif;
    padding: 15px;
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
</style>
