<template>
  <b-container fluid>
    <header class="py-2">
      <router-link
        id="home-link"
        :to="homeRoute"
      >
        <img
          id="logo"
          srcset="img/logo-rounded-50.png 1x, img/logo-rounded-100.png 2x, img/logo-rounded-150.png 3x"
          src="img/logo-rounded-150"
          alt="Sooner's logo"
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
      <p>Add to Pocket is a browser extension for quickly adding pages to your list while browsing the web. Just click the button to add.</p>
      <div class="ext-container">
        <a
          href="https://chrome.google.com/webstore/detail/add-to-sooner/jaggkbmnhinipdnbihmbfcbdnnmkipnp"
          target="_blank"
        >
          <img
            src="img/chrome-web-store-badge.png"
            alt="Available in the Chrome Web Store"
          >
        </a><a
          href="https://microsoftedge.microsoft.com/addons/detail/add-to-sooner/nlchodjgamjfniiaghngodkmmajcebbj"
          target="_blank"
        >
          <img
            src="img/ms-badge.png"
            alt="Available in the Microsoft Edge Add-ons store"
          >
        </a>
      </div>
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

<style scoped>
h1, h2, h3, h4 {
  font-weight: 500;
}

#home-link {
  display: flex;
  align-items: center;

  color: #212121;
  text-decoration: none;
}

li {
  margin-bottom: 0.3em;
}

.ext-container {
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
}

.ext-container img {
  width: 250px;
  margin: 10px;
}
</style>
