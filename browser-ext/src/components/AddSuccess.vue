<template>
  <div>
    <small-header />
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex">
        <b-icon class="h4 mb-0 mr-3" icon="check-circle-fill" variant="success" />
        <h5 class="mb-0"> Page added!</h5>
      </div>
      <div class="delete-icon" @click="onDelete" role="button">
        <b-icon icon="trash" class="h5 m-0" variant="danger" />
      </div>
    </div>
  </div>
</template>

<script>
import { deleteLink } from '../api'
import SmallHeader from './SmallHeader.vue'
export default {
  props: ['linkId'],
  components: { SmallHeader },
  methods: {
    async onDelete () {
      try {
        await deleteLink(this.linkId)
      } catch (error) {

      } finally {
        window.close()
      }
    }
  }
}
</script>

<style scoped>
.message-container {
  flex: 1;
}
.delete-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
}
.delete-icon:hover {
  background-color: #0000000f;
  cursor: pointer;
}
</style>
