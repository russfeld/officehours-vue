<script setup>
import { RouterLink } from 'vue-router'
import { tokenStore } from '@/stores/Token'
import { queueStore } from '@/stores/Queues'
import { storeToRefs } from 'pinia'

const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

const user = tokenStore()

const queues = queueStore()
await queues.hydrate()

const { queue } = storeToRefs(queues)

queues.getQueueById(props.id)

const toggleQueue = async function (id) {
  await queues.toggleQueue(id)
  queues.getQueueById(props.id)
}
</script>

<template>
  <main>
    <router-link :to="{ name: 'queues' }" class="btn btn-secondary float-start"
      ><font-awesome-icon icon="arrow-left" /> Back</router-link
    >
    <router-link
      v-if="user.is_admin"
      :to="{ name: 'queue_edit', params: { id: queue.id } }"
      class="btn btn-secondary float-end"
      ><font-awesome-icon icon="pen-to-square" /> Edit</router-link
    >
    <h1 class="display-5 text-center">{{ queue.name }}</h1>
    <hr />
    <div>
      {{ queue.description }}
    </div>
    <hr />
    <div class="d-flex">
      <div class="mx-auto d-block">
        <template v-if="queue.helper == 1">
          <h2 class="text-center">Moderate Queue</h2>
          <template v-if="queue.is_open == 1">
            <a class="w-100 btn btn-danger" @click="toggleQueue(queue.id)"
              >Close Queue</a
            >
            <p>Queue Here!</p>
          </template>
          <template v-else>
            <a class="w-100 btn btn-success" @click="toggleQueue(queue.id)"
              >Open Queue</a
            >
          </template>
        </template>
        <template v-else>
          <h2 class="text-center">Waiting Queue</h2>
          <template v-if="queue.is_open == 1">
            <a class="w-100 btn btn-success">Join Queue</a>
            <p>Queue Here!</p>
          </template>
          <template v-else>
            <a class="w-100 btn btn-danger" disabled>Queue is Closed</a>
          </template>
        </template>
      </div>
    </div>
  </main>
</template>
