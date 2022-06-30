<script setup>
// Imports
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { setErrors } from '@formkit/vue'
import VueMultiselect from 'vue-multiselect'
import { storeToRefs } from 'pinia'
import EasyMDE from 'easymde'

// Stores
import { useQueuesStore } from '@/stores/Queues'
import { useUsersStore } from '@/stores/Users'

// Configure Router
const router = useRouter()

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Queues Store
const queuesStore = useQueuesStore()
await queuesStore.hydrate()
const queue = queuesStore.getQueue(props.id)

// Users Store
const usersStore = useUsersStore()
usersStore.hydrate()
const { users } = storeToRefs(usersStore)

// Configure EasyMDE
var easyMDE
onMounted(() => {
  easyMDE = new EasyMDE({
    blockStyles: {
      italic: '_',
    },
    status: false,
  })
})

// Save Queue
const save = async (data) => {
  data = (({ id, name, snippet }) => ({
    id,
    name,
    snippet,
  }))(data)
  data['description'] = easyMDE.value()
  // only send user ids of related users
  data['users'] = []
  for (const user of queue.users) {
    data['users'].push({
      id: user.id,
    })
  }
  try {
    await queuesStore.update(data)
    router.push('/queues/' + queue.id)
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
          'queueform',
          [
            'The server rejected this submission. Please correct errors listed above',
          ],
          errors // (optional) input level errors
        )
      } else {
        setErrors('queueform', [
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
    <h1 class="display-5 text-center">Edit Queue</h1>
    <hr />
    <FormKit
      id="queueform"
      type="form"
      :value="queue"
      :actions="false"
      @submit="save"
    >
      <FormKit
        type="text"
        name="name"
        label="Queue Name"
        help="Name of the queue (usually the course)"
        validation="required"
      />
      <FormKit
        type="text"
        name="snippet"
        label="Short Description"
        help="Short description shown on the initial card"
      />
      <FormKit
        type="textarea"
        name="description"
        label="Long Description"
        help="Long description shown on the queue page"
        rows="10"
      />
      <div class="mb-3">
        <label for="multiselect-users" class="form-label">Helpers</label>
        <VueMultiselect
          id="multiselect-users"
          v-model="queue.users"
          class="form-control"
          :options="users"
          :multiple="true"
          tag-placeholder="Add this as new user"
          placeholder="Type to search or add user"
          label="eid"
          track-by="id"
        />
        <div class="form-text">
          Helpers who can manage the queue (usually TAs) - admins already have
          access
        </div>
      </div>
      <div class="row row-cols-1 row-cols-md-2">
        <div class="col d-grid mb-2">
          <button class="btn btn-success">Save</button>
        </div>
        <div class="col d-grid mb-2">
          <router-link
            :to="{ name: 'queue_single', params: { id: queue.id } }"
            class="btn btn-secondary"
          >
            Cancel</router-link
          >
        </div>
      </div>
    </FormKit>
  </main>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

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
