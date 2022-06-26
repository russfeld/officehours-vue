<script setup>
// Imports
import { onBeforeRouteLeave } from 'vue-router'

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
requestsStore.connectQueue(props.id)

// Disable Queue
const disableQueue = async function () {
  await requestsStore.closeQueue()
}

// Enable Queue
const enableQueue = async function () {
  await requestsStore.openQueue()
}

// Disconnect Socket on Leave
onBeforeRouteLeave(async () => {
  await requestsStore.disconnectQueue()
})
</script>

<template>
  <h2 class="text-center">Moderate Queue</h2>
  <template v-if="getQueue(id).is_open == 1">
    <a class="w-100 btn btn-success" @click="disableQueue"
      >Queue is Open - Click to Close</a
    >
    <hr />
    <RequestList :id="id" helper />
  </template>
  <template v-else>
    <a class="w-100 btn btn-danger" @click="enableQueue"
      >Queue is Closed - Click to Open</a
    >
  </template>
</template>
