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
    @ok="save">
  <template #default>
    <div>
      <h6>Display Name</h6>
      <b-form-input v-model="displayName"/>
    </div>
    <div>
      <h6>Email</h6>
      <b-form-input v-model="email" disabled />
    </div>
    <div>
      <h6>Link Time Limit</h6>
      <b-form-input v-model="ttl" type="range" min="1" max="10" />
      {{ ttlStr }}
    </div>
    <div>
      <h6>Sort Links</h6>
      <b-form-group class="text-center">
        <b-form-radio-group>
          <b-form-radio name="sort-direction" value="asc">Newest first</b-form-radio>
          <b-form-radio name="sort-direction" value="desc">Oldest first</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </div>
  </template>
  </b-modal>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      displayName: '',
      email: '',
      ttl: ''
    }
  },
  computed: {
    ttlStr () {
      let str = `${this.ttl} day`
      if (parseInt(this.ttl) > 1) { str += 's' }
      return str
    },
    ...mapGetters({
      userData: 'user/data'
    })
  },
  methods: {
    onShow () {
      this.displayName = this.userData.name
      this.email = this.userData.email
      this.ttl = this.userData.prefs.linkTTL
    },
    async save () {
      const changes = {
        name: this.displayName,
        email: this.email,
        prefs: {
          linkTTL: parseInt(this.ttl)
        }
      }
      const result = await this.updateUserData(changes)

      if (result.error) {
        this.$toast.error(result.reason)
      }
    },
    ...mapActions({
      updateUserData: 'user/updateData'
    })
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
 margin-bottom: 1.5rem;
}
</style>
