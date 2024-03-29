<template>
  <div class="pb-3">
    <header class="p-3">
      <img
        id="logo"
        srcset="img/logo-rounded-50.png 1x, img/logo-rounded-100.png 2x, img/logo-rounded-150.png 3x"
        src="img/logo-rounded-150"
        alt="Sooner's logo"
        class="mr-4"
      >
      <h1 class="m-0">
        Sooner
      </h1>
    </header>
    <section
      id="intro-section"
      class="mb-5"
    >
      <img
        id="hero-image"
        srcset="img/hero-720.png 1x, img/hero-1440.png 2x"
        src="img/hero-1440.png 2x"
        alt="Sooner working on mobile, desktop, and tablet devices"
        class="mb-4 rounded"
      >
      <h3>The problem of overwhelming reading lists is solved</h3>
      <p>
        Sooner is your self-cleaning reading list that never grows unweildy like your bookmarks or read-it-later list
        probably is right now. Sooner is your place for everything on the web you care about right now.
      </p>
      <div id="cta-container">
        <router-link :to="loginRoute">
          <b-button variant="primary">
            Sign Up | Log In
          </b-button>
        </router-link>
        <router-link :to="appsRoute">
          <b-button variant="primary">
            Get the apps
          </b-button>
        </router-link>
      </div>
    </section>
    <section
      id="qa-section"
      class="mb-5"
    >
      <h5>🤔 Self-cleaning?</h5>
      <p>
        Sooner works in a simple way. Every unread item you put on your list is deleted after a few days.
      </p>
      <h5>😨 Deleted?</h5>
      <p>Yes, deleted. Like gone... <em>forever</em>.</p>
      <h5>🤨 How could this possibly be a good thing?</h5>
      <p>
        First, we must face the facts. You're probably never going to get back to those pages! Instead of clutching onto your never-ending list of tabs, bookmarks or articles forever, <a href="https://twitter.com/zakiyajamal/status/1328431305240043520">you should let them go</a>.
      </p>
      <h5>😭 But my stuff!</h5>
      <p>
        I know breakups are hard, but Sooner takes care of this heart-wrenching process by deleting that stuff for you. If something on your list expires, so be it. Trust me, it's liberating!
      </p>
      <h5>😕 Okay you're throwing my stuff away... what am I left with?</h5>
      <p>
        Set up this way, your Sooner list is only ever filled with things you care about right now. It's easy to add stuff you like so go crazy. If you really feel like something on your list is important, you should read it sooner rather than later.
      </p>
      <p class="text-center">
        Still not convinced? Just try it, it's free:
      </p>
      <div class="text-center">
        <router-link :to="loginRoute">
          <b-button variant="primary">
            Sign Up
          </b-button>
        </router-link>
      </div>
    </section>
    <footer>
      <hr>
      <div>Created by <a href="https://github.com/arosiclair">Andrew Rosiclair</a></div>
      <div>Source on <a href="https://github.com/arosiclair/sooner">GitHub</a></div>
      <div>
        <router-link :to="privacyRoute">
          Privacy Policy
        </router-link>
      </div>
    </footer>
  </div>
</template>

<script>
import { RouteNames } from '../router'
export default {
  data () {
    return {
      loginRoute: {
        name: RouteNames.Login
      },
      appsRoute: {
        name: RouteNames.Apps
      },
      privacyRoute: {
        name: RouteNames.Privacy
      }
    }
  }
}
</script>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: center;
}

h1, h3, h5 {
  font-weight: 500;
}

#hero-image {
  width: 100%;
}

#intro-section p {
  font-size: 1.2rem;
  text-align: start;
}

#cta-container > a {
  margin: 0.3rem;
}

#qa-section > * {
  font-size: 1.1rem;
  text-align: start;
}

#qa-section > h5 {
  margin-bottom: 0.6rem;
}
</style>
