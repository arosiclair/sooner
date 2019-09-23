<template>
  <div>
    <img
      id="logo"
      src="http://via.placeholder.com/150"
      alt="logo" />
    <form>
      <div v-if="error">Error msg: {{ error }}</div>
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
          type="text"
          placeholder="Email" />
        <input
          v-model="password"
          class="last"
          type="password"
          placeholder="Password" />
      </div>
      <button id="loginButton" @click="loginBtnClicked" type="button">
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
      error: ''
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
            console.log('Log in failed!', res.data)
          }
        })
    },
    validateLogin: function () {
      if (this.email.length <= 0) {
        return 'Enter a valid email'
      } else if (this.password.length <= 0) {
        return 'Enter a password'
      } else {
        return null
      }
    }
  }
}
</script>

<style>
    #loginFields {
        border-radius: 2px;
        overflow: hidden;
        box-shadow: 0 1px 4px 0 rgba(0,0,0,0.37);
        margin-bottom: 20px;
    }

    #logo {
        margin-bottom: 50px;
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
        border-radius: 2px;

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
</style>
