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
const getQueue = queuesStore.getQueue

// Requests Store
const requestsStore = useRequestsStore()

if (getQueue(props.id).is_open) {
  requestsStore.joinQueue(props.id)
}

const disableQueue = async function () {
  await requestsStore.closeQueue()
  queuesStore.hydrate()
}

// Enable/Disable Queue
const enableQueue = async function (id) {
  await queuesStore.openQueue(id)
  requestsStore.joinQueue(props.id)
}
</script>

<template>
  <h2 class="text-center">Moderate Queue</h2>
  <template v-if="getQueue(id).is_open == 1">
    <a class="w-100 btn btn-danger" @click="disableQueue">Close Queue</a>
    <RequestList :id="id" />
  </template>
  <template v-else>
    <a class="w-100 btn btn-success" @click="enableQueue">Open Queue</a>
  </template>
</template>
