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
      <b-button @click="onSubSubscribePush">
        Subscribe Push
      </b-button>
      <div>
        Title
        <b-form-input v-model="title" />
        Body
        <b-form-input v-model="body" />
      </div>
    </b-modal>
  </div>
</template>

<script>
import { showNotification, subscribeForPush } from '../../modules/notification'

export default {
  data () {
    return {
      title: '',
      body: ''
    }
  },
  methods: {
    showMockNotification () {
      showNotification(this.title, this.body)
    },
    onSubSubscribePush () {
      subscribeForPush()
    }
  }
}
</script>

<style>

</style>
