<script setup>
// Imports
import { onBeforeRouteLeave } from 'vue-router'

// Components
import RequestList from './RequestList.vue'
import HelperList from './HelperList.vue'

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
  <div class="queue-header mx-auto">
    <h2 class="text-center">Moderate Queue</h2>
    <template v-if="getQueue(id).is_open == 1">
      <a class="w-100 btn btn-success" @click="disableQueue"
        >Queue is Open - Click to Close</a
      >
    </template>
    <template v-else>
      <a class="w-100 btn btn-danger" @click="enableQueue"
        >Queue is Closed - Click to Open</a
      >
    </template>
  </div>
  <hr />
  <div class="row">
    <div class="col-12 col-md-4 mb-4">
      <HelperList />
    </div>
    <div class="col-12 col-md-8 mb-4">
      <RequestList :id="id" helper />
    </div>
  </div>
</template>

<style scoped>
.queue-header {
  max-width: 500px;
}
</style>
