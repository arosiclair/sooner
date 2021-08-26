<template>
  <b-modal
    id="settings-modal"
    content-class="settings-modal shadow-lg rounded"
    header-class="settings-header"
    body-class="settings-body"
    footer-class="settings-footer"
    title="Settings"
    centered
    @show="onShow"
  >
    <template #default>
      <div>
        <h6>Display Name</h6>
        <b-form-input
          v-model="displayName"
          class="form"
        />
      </div>
      <div>
        <h6>Email</h6>
        <b-form-input
          v-model="email"
          class="form"
          disabled
        />
      </div>
      <div>
        <h6>Link Time Limit</h6>
        <b-form-input
          v-model="ttl"
          type="range"
          min="1"
          max="10"
        />
        <div class="text-center">
          {{ ttlStr }}
        </div>
      </div>
      <div>
        <h6>Sort Links</h6>
        <b-form-group class="text-center">
          <b-form-radio-group
            v-model="linkOrder"
            name="link-order"
          >
            <b-form-radio value="asc">
              Oldest first
            </b-form-radio>
            <b-form-radio value="desc">
              Newest first
            </b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>
      <div>
        <h6>Done Sound</h6>
        <b-form-checkbox
          v-model="doneSound"
          class="text-center align-middle"
        >
          Enabled
        </b-form-checkbox>
      </div>
      <div>
        <h6>Notifications</h6>
        <div class="px-4">
          <b-form-checkbox
            v-model="notificationsEnabled"
            class="text-center align-middle mb-2"
            @change="onPushNotificationsChanged"
          >
            Enabled
          </b-form-checkbox>

          <span>Reminders</span>
          <div class="push-notifications-settings">
            <b-form-checkbox
              v-model="remindersEnabled"
              class="text-center align-middle d-flex-1"
              :disabled="!notificationsEnabled"
            >
              Enabled
            </b-form-checkbox>
            <b-form-timepicker
              v-model="reminderTime"
              :disabled="!notificationsEnabled || !remindersEnabled"
            />
          </div>
        </div>
      </div>
    </template>
    <template #modal-footer>
      <b-button
        variant="primary"
        class="save-btn"
        @click="save"
      >
        <b-spinner
          v-if="saving"
          small
        />
        <span v-else>Save</span>
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { subscribeForPush } from '../modules/notification'
export default {
  data () {
    return {
      displayName: '',
      email: '',
      ttl: '',
      linkOrder: '',
      doneSound: false,
      saving: false,
      notificationsEnabled: false,
      remindersEnabled: false,
      reminderTime: ''
    }
  },
  computed: {
    ttlStr () {
      let str = `${this.ttl} day`
      if (parseInt(this.ttl) > 1) { str += 's' }
      return str
    },
    reminderHour () {
      if (!this.reminderTime) return ''

      const timeParts = this.reminderTime.split(':')
      return timeParts[0]
    },
    reminderMinute () {
      if (!this.reminderTime) return ''

      const timeParts = this.reminderTime.split(':')
      return timeParts[1]
    },
    payload () {
      return {
        name: this.displayName,
        email: this.email,
        prefs: {
          linkTTL: parseInt(this.ttl),
          linkOrder: this.linkOrder,
          doneSound: this.doneSound
        }
      }
    },
    pushPayload () {
      return {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        enabled: this.notificationsEnabled,
        reminders: {
          enabled: this.remindersEnabled,
          reminderHour: Number(this.reminderHour),
          reminderMinute: Number(this.reminderMinute)
        }
      }
    },
    ...mapGetters({
      userData: 'user/data'
    })
  },
  methods: {
    ...mapActions({
      updateUserData: 'user/updateData'
    }),
    onShow () {
      this.displayName = this.userData.name
      this.email = this.userData.email
      this.ttl = this.userData.prefs.linkTTL
      this.linkOrder = this.userData.prefs.linkOrder
      this.doneSound = this.userData.prefs.doneSound

      const pushPrefs = this.userData.prefs.push
      this.notificationsEnabled = pushPrefs.enabled
      const reminders = this.userData.prefs.push.reminders || {}
      this.remindersEnabled = reminders.enabled
      if (typeof reminders.reminderHour === 'number' && typeof reminders.reminderMinute === 'number') {
        this.reminderTime = `${reminders.reminderHour}:${reminders.reminderMinute}:00`
      }
    },
    async save () {
      this.saving = true
      const result = await this.updateUserData({
        userChanges: this.payload,
        pushChanges: this.pushPayload
      })

      this.saving = false
      if (result.error) {
        this.$toast.error(result.reason)
      } else {
        this.$bvModal.hide('settings-modal')
      }
    },
    async onPushNotificationsChanged (checked) {
      if (checked) {
        this.pushNotifications = await subscribeForPush()
        if (!this.pushNotifications) {
          this.$toast.error("Couldn't enable push notifications. Did you disable notifications?", { timeout: false })
        }
      } else {
        // TODO: unsubscribe from push
      }
    }
  }
}
</script>

<style>
.settings-modal {
  border: none;
}

.settings-header {
  border: none;
}

.settings-footer {
  border: none;
}

.settings-body > div:not(:last-child) {
 margin-bottom: 2rem;
}
</style>

<style scoped>
.save-btn {
  width: 75px;
}

.push-notifications-settings {
  display: flex;
  align-items: center;
}

.push-notifications-settings > * {
  flex: 1;
}
</style>
