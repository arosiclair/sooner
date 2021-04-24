<template>
  <div>
    <b-btn v-b-modal.mock-notif-modal>
      Mock Notification
    </b-btn>
    <b-modal
      id="mock-notif-modal"
      title="Mock Notification"
      ok-title="Send"
      @ok="showMockNotification"
    >
      Title
      <b-form-input v-model="title" />
      Body
      <b-form-input v-model="body" />
    </b-modal>
  </div>
</template>

<script>
import { showNotification } from '../../modules/notification'

export default {
  data () {
    return {
      title: '',
      body: ''
    }
  },
  methods: {
    async showMockNotification () {
      showNotification(this.title, this.body)
    }
  }
}
</script>

<style>

</style>
