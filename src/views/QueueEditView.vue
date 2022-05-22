<script setup>
import { queueStore } from '@/stores/Queues'
import { useRouter } from 'vue-router'
import { setErrors } from '@formkit/vue'
const router = useRouter()

const props = defineProps(['id'])

const queues = queueStore()

const queue = queues.getQueueById(props.id)

const save = async (data) => {
  data = (({ id, name, snippet, description }) => ({
    id,
    name,
    snippet,
    description,
  }))(data)
  try {
    await queues.update(data)
    router.push('/queues/' + queue.id)
  } catch (error) {
    if (error.response && error.response.status === 422) {
      let errors = {}
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
      type="form"
      id="queueform"
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
