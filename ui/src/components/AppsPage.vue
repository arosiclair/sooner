<template>
  <b-container fluid>
    <header class="py-2">
      <router-link
        id="home-link"
        :to="homeRoute"
      >
        <img
          id="logo"
          src="img/logo-rounded.png"
          alt="Sooner logo"
          class="mr-3"
        >
        <h3
          id="logo-text"
          class="m-0"
        >
          Sooner
        </h3>
      </router-link>
    </header>
    <section class="text-left">
      <h2 class="text-center">
        Apps
      </h2>
      <h4>Web App</h4>
      <p>You're on it! This web app is installable on iOS, Android, Windows and macOS. Install the app for the full experience!</p>
      <ul>
        <li>
          <b>Android (Chrome)</b> You should be prompted to install or "Add Sooner to Home screen". If not, you can open the <b-icon icon="three-dots-vertical" /> menu and select "Add to Home screen" as well.
        </li>
        <li>
          <b>iOS (Safari)</b> select the share button and select the "Add to Home Screen" option.
        </li>
        <li><b>Windows & Mac (Chrome)</b> select the install button on the right side of the URL bar</li>
      </ul>
      <h4>Add to Pocket Extension</h4>
      <p>Add to Pocket is a browser extension for quickly adding pages to your list. Just click the button to add.</p>
      <b-row>
        <b-col
          sm="12"
          md="6"
          class="text-center"
        >
          <a
            href="https://chrome.google.com/webstore/detail/add-to-sooner/jaggkbmnhinipdnbihmbfcbdnnmkipnp"
            target="_blank"
          >
            <img
              id="chrome-web-store-img"
              src="img/chrome-web-store-badge.png"
              alt="Available in the Chrome Web Store"
            >
          </a>
        </b-col>
      </b-row>
    </section>
  </b-container>
</template>

<script>
import { RouteNames } from '../router'
export default {
  data () {
    return {
      homeRoute: {
        name: RouteNames.Landing
      }
    }
  }
}
</script>

<style>
h1, h2, h3, h4 {
  font-weight: 900;
}

#home-link {
  display: flex;
  align-items: center;

  color: #212121;
  text-decoration: none;
}

#logo {
  width: 40px;
}

li {
  margin-bottom: 0.3em;
}

#chrome-web-store-img {
  width: 75%;
}
</style>
