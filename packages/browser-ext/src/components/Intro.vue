<template>
  <div>
    <small-header class="mb-2" />
    <div class="px-2">
      <div class="d-flex align-items-center mb-2">
        <span class="hello-icon mr-2">👋</span>
        <h5 class="m-0">
          Welcome!
        </h5>
      </div>
      <div>
        Quickly add pages to your list by
        <ul>
          <li>Selecting this icon to add the current page</li>
          <li>Right clicking a link and selecting 'Add to Sooner'</li>
        </ul>
        <div class="text-right">
          <button
            class="confirm-btn"
            @click="onConfirm"
          >
            👍
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RouteNames } from '../popup/router'
import { setHasReadIntro } from '../has-read-intro'
import SmallHeader from './SmallHeader.vue'
export default {
  components: { SmallHeader },
  methods: {
    onConfirm () {
      setHasReadIntro(true)
      this.$router.push({ name: RouteNames.Adding })
    }
  }

}
</script>

<style scoped>
ul {
    padding-left: 20px;
    margin: 0;
}

.confirm-btn {
    border: none;
    background-color: transparent;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
}

.confirm-btn:hover {
    background-color: #0000000f;
}
</style>
