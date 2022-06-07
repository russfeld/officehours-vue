<script setup>
// Components
import RequestList from './RequestList.vue'

// Stores
import { useQueuesStore } from '@/stores/Queues'
import { useRequestsStore } from '@/stores/Requests'

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
const queue = queuesStore.queues.find((queue) => queue.id === props.id)

// Requests Store
const requestsStore = useRequestsStore()

// Join Queue
const joinQueue = async function (id) {
  await requestsStore.joinQueue(id)
}
</script>

<template>
  <h2 class="text-center">Waiting Queue</h2>
  <template v-if="queue.is_open == 1">
    <a class="w-100 btn btn-success" @click="joinQueue(id)">Join Queue</a>
    <RequestList :id="id" />
  </template>
  <template v-else>
    <a class="w-100 btn btn-danger" disabled>Queue is Closed</a>
  </template>
</template>
