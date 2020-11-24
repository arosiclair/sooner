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
      <b-form-input v-model="displayName" class="form-input"/>
    </div>
    <div>
      <h6>Email</h6>
      <b-form-input v-model="email" class="form-input" disabled />
    </div>
    <div>
      <h6>Link Time Limit</h6>
      <b-form-input v-model="ttl" type="range" min="1" max="10" />
      <div class="text-center">
        {{ ttlStr }}
      </div>

    </div>
    <div>
      <h6>Sort Links</h6>
      <b-form-group class="text-center">
        <b-form-radio-group v-model="linkOrder" name="link-order">
          <b-form-radio value="asc">Oldest first</b-form-radio>
          <b-form-radio value="desc">Newest first</b-form-radio>
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
      ttl: '',
      linkOrder: ''
    }
  },
  computed: {
    ttlStr () {
      let str = `${this.ttl} day`
      if (parseInt(this.ttl) > 1) { str += 's' }
      return str
    },
    payload () {
      return {
        name: this.displayName,
        email: this.email,
        prefs: {
          linkTTL: parseInt(this.ttl),
          linkOrder: this.linkOrder
        }
      }
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
      this.linkOrder = this.userData.prefs.linkOrder
    },
    async save () {
      const result = await this.updateUserData(this.payload)

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
 margin-bottom: 2rem;
}

</style>
