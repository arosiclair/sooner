<template>
  <div>
    <header class="py-2">
      <router-link
        class="header-link"
        :to="homeRoute"
      >
        <Logo50 class="mr-3" />
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
        Privacy Policy
      </h2>
      <p>Vistors and users of Sooner and its apps will be subject to the following privacy and data handling practices.</p>
      <h4>Visitors</h4>
      <p>No personal information is collected or handled by unregistered visitors of this website.</p>
      <h4>Sooner Users</h4>
      <p>Sooner Users (those who have created a user account), are required to submit the following information for account creation</p>
      <ul>
        <li>Name</li>
        <li>Email address</li>
        <li>Password</li>
      </ul>
      <p>In use of Sooner apps, Sooner Users may submit the following information</p>
      <ul>
        <li>URLs of web pages</li>
      </ul>
      <p>The following additional information may be collected in order to provide core functionality for Sooner apps</p>
      <ul>
        <li>
          Metadata from submitted web page URLs including
          <ul>
            <li>Page titles</li>
            <li>Page icons</li>
            <li>The date and time of submission</li>
          </ul>
        </li>
      </ul>
      <p>Sooner sets and uses cookies for the following purposes</p>
      <ul>
        <li>
          Sooner User authentication
        </li>
      </ul>
      <p>The above information collected from Sooner Users is kept in Sooner databases only for the minimal necessary time to provide core functionality for Sooner apps</p>
    </section>
  </div>
</template>

<script>
import { RouteNames } from '../router'
import Logo50 from './Logo50.vue'
export default {
  components: { Logo50 },
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
h2, h3, h4 {
  font-weight: 900;
}

.header-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: initial;
}

</style>
