<template>
  <div>
    <img
      id="logo"
      src="http://via.placeholder.com/150"
      alt="logo" />
    <form>
      <div v-if="error" id="error-div" class="alert alert-danger">
        {{ error }}
      </div>
      <div
        id="loginFields"
        action="#">
        <input
          v-if="registering"
          v-model="name"
          class="first"
          type="text"
          placeholder="Name" />
        <input
          v-model="email"
          :class="{ error: emailError }"
          type="text"
          placeholder="Email"
          @keyup.enter="loginBtnClicked" />
        <input
          v-model="password"
          class="last"
          :class="{ error: passwordError }"
          type="password"
          placeholder="Password"
          @keyup.enter="loginBtnClicked" />
      </div>
      <button id="loginButton" type="button" @click="loginBtnClicked">
        {{ registering ? 'SIGN UP' : 'LOGIN' }}
      </button>
      <a id="signUpLink" href="#" @click="registering = !registering">{{ registering ? 'CANCEL' : 'SIGN UP' }}</a>
    </form>
  </div>
</template>

<script>
import api from './api'
import currentUser from './user'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      registering: false,
      error: '',
      emailError: false,
      passwordError: false
    }
  },
  computed: {
    validInput: function () {
      if (this.registering) {
        return true
      } else {
        return this.name.length > 0 && this.password.length > 0
      }
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
    register: function () {
      var data = {
        name: this.name,
        email: this.email,
        password: this.password
      }

      api.post(API_URL + '/users/register', data)
        .then(res => {
          if (res.data.result === 'success') {
            console.log('Sign up successful!')

            // update user module
            currentUser.name = res.data.name
            currentUser.token = res.data.token

            this.$emit('logged-in')
          } else {
            console.log('Sign up failed!', res.data)
          }
        })
    },
    login: function () {
      this.resetErrors()
      this.error = this.validateLogin()
      if (this.error) {
        return
      }

      var loginData = {
        email: this.email,
        password: this.password
      }
      api.post(API_URL + '/users/login', loginData)
        .then(res => {
          if (res.data.result === 'success') {
            console.log('Log in successful!')

            // update user module
            currentUser.name = res.data.name
            currentUser.token = res.data.token

            this.$emit('logged-in')
          } else {
            this.error = 'Incorrect email or password'
            console.log('Log in failed!', res.data)
          }
        })
    },
    validateLogin: function () {
      if (this.email.length <= 0) {
        this.emailError = true
        return 'Enter a valid email'
      } else if (this.password.length <= 0) {
        this.passwordError = true
        return 'Enter a password'
      } else {
        return null
      }
    },
    resetErrors: function () {
      this.error = null
      this.passwordError = false
      this.emailError = false
    }
  }
}
</script>

<style>
    #loginFields {
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
        margin-bottom: 20px;
    }

    #logo {
        margin-bottom: 20px;
    }

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

    #loginButton {
        width: 100%;
        height: 66px;
        margin-bottom: 10px;
        background-color: #ffffff;
        font-family: 'Rubik', sans-serif;
        color: #212121;
        border: none;

        font-size: 24px;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
        border-radius: 5px;

        transition: 0.5s ease;
    }
    #loginButton:focus {
        outline: none;
    }
    #loginButton:hover {
        box-shadow: 0 1px 10px 0 rgba(0,0,0,0.37);
    }
    #signUpLink {
        font-family: 'Rubik', sans-serif;
    }

    #error-div {
      font-family: 'Rubik', sans-serif;
    }
</style>
