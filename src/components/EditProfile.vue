<script setup>
// Imports
import { setErrors } from '@formkit/vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

// Stores
import { useProfileStore } from '@/stores/Profile'

// Load Router
const router = useRouter()

// Profile Store
const profileStore = useProfileStore()
await profileStore.hydrate()
const { user } = storeToRefs(profileStore)

// Save Profile Information
const save = async (data) => {
  data = (({ name, contact_info }) => ({
    name,
    contact_info,
  }))(data)
  try {
    await profileStore.update(data)
    router.push('/queues/')
  } catch (error) {
    if (error.response && error.response.status === 422) {
      let errors = {}
      if (error.response.data.data) {
        for (const input in error.response.data.data) {
          errors[input] = ''
          for (const message of error.response.data.data[input]) {
            errors[input] = errors[input] + message.message + ' '
          }
        }
        setErrors(
          'userform',
          [
            'The server rejected this submission. Please correct errors listed above',
          ],
          errors // (optional) input level errors
        )
      } else {
        setErrors('userform', [
          'The server rejected this submission due to an SQL Error. Refresh and try again',
        ])
      }
    } else {
      console.error(error)
    }
  }
}
</script>

<template>
  <main>
    <h1 class="display-5 text-center">Edit User</h1>
    <hr />
    <FormKit
      id="userform"
      type="form"
      :value="user"
      :actions="false"
      @submit="save"
    >
      <FormKit
        type="text"
        name="eid"
        label="eID"
        :disabled="true"
        help="Your K-State eID (cannot be changed)"
        validation="required"
      />
      <FormKit
        type="text"
        name="name"
        label="Name"
        help="Your full name as you'd like it displayed on the site"
        validation="required"
      />
      <!-- TODO: WYSIWIG Editor -->
      <FormKit
        type="textarea"
        name="contact_info"
        label="Contact Information"
        help="Any information we should know about how to contact you"
        rows="10"
      />
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col d-grid mb-2">
          <button class="btn btn-success">Save</button>
        </div>
        <div class="col d-grid mb-2">
          <router-link :to="{ name: 'queues' }" class="btn btn-secondary">
            Cancel</router-link
          >
        </div>
      </div>
    </FormKit>
  </main>
</template>

<style>
.formkit-messages {
  list-style-type: none;
  padding-left: 0px;
  color: red;
}

[data-invalid] .formkit-inner {
  border-color: red;
  box-shadow: 0 0 0 1px red;
}

[data-complete] .formkit-inner {
  border-color: red;
  box-shadow: 0 0 0 1px green;
}
</style>
