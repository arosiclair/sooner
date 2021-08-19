<template>
  <div>
    <b-btn v-b-modal.mock-notif-modal>
      Mock Notification
    </b-btn>
    <b-modal
      id="mock-notif-modal"
      title="Mock Notification"
      ok-title="Send"
      @ok="onSend"
    >
      <b-button @click="onSubSubscribePush">
        Subscribe Push
      </b-button>
      <div>
        Title
        <b-form-input v-model="title" />
        Body
        <b-form-input v-model="body" />
        <b-form-checkbox v-model="remote">
          Remote
        </b-form-checkbox>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { sendDebugNotification, showLocalNotificaiton, subscribeForPush } from '../../modules/notification'

export default {
  data () {
    return {
      title: '',
      body: '',
      remote: false
    }
  },
  methods: {
    onSend () {
      if (this.remote) {
        this.sendRemoteNotification()
      } else {
        this.showMockNotification()
      }
    },
    showMockNotification () {
      showLocalNotificaiton(this.title, this.body)
    },
    sendRemoteNotification () {
      sendDebugNotification(this.title, this.body)
    },
    onSubSubscribePush () {
      subscribeForPush()
    }
  }
}
</script>

<style>

</style>
