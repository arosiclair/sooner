<template>
  <div class="pb-3">
    <div class="title-container p-3">
      <img
        id="logo"
        src="img/logo-rounded.png"
        alt="Sooner logo"
        class="mr-4"
      >
      <h1>Sooner</h1>
    </div>
    <section
      id="intro-section"
      class="mb-5"
    >
      <img
        id="hero-image"
        src="https://via.placeholder.com/600x300"
        alt=""
        class="mb-4"
      >
      <h3>The problem of overwhelming reading lists is solved</h3>
      <p>
        Sooner is your self-cleaning reading list that never grows unweildy like your bookmarks or read-it-later list
        probably is right now. Sooner is your place for everything on the web you care about right now.
      </p>
      <router-link :to="loginRoute">
        <b-button
          variant="primary"
        >
          Sign Up | Log In
        </b-button>
      </router-link>
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
        First, we must face the facts. You're probably never going to get back to those pages! Instead of
        clutching onto your never-ending list of tabs, bookmarks or articles forever, <a href="#">you should let them go</a>.
      </p>
      <h5>😭 But my stuff!</h5>
      <p>
        I know breakups are hard, but Sooner takes care of this heart-wrenching process by deleting that stuff for you. If something on your list expires, so be it. Trust me, it's liberating!
      </p>
      <h5>😕 Okay you're throwing my stuff away... what am I left with?</h5>
      <p>
        Set up this way, your Sooner list is only ever filled with things you care qa right now. It's easy to to add stuff you like so go crazy. If you really feel like something on your list is important, you should read it sooner rather than later.
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
      }
    }
  }
}
</script>

<style scoped>
.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

#logo {
  width: 50px;
}

h1, h3, h5 {
  font-weight: 900;
}

#hero-image {
  width: 80%;
}

#intro-section p {
  font-size: 1.2rem;
  text-align: start;
}

#qa-section > * {
  font-size: 1.1rem;
  text-align: start;
}

#qa-section > h5 {
  margin-bottom: 0.6rem;
}
</style>
