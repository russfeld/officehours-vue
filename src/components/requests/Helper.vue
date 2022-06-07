<script setup>
// Components
import RequestList from './RequestList.vue'

// Stores
import { useQueuesStore } from '@/stores/Queues'

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

// Enable/Disable Queue
const toggleQueue = async function (id) {
  await queuesStore.toggleQueue(id)
}
</script>

<template>
  <h2 class="text-center">Moderate Queue</h2>
  <template v-if="getQueue(id).is_open == 1">
    <a class="w-100 btn btn-danger" @click="toggleQueue(id)">Close Queue</a>
    <RequestList :id="id" />
  </template>
  <template v-else>
    <a class="w-100 btn btn-success" @click="toggleQueue(id)">Open Queue</a>
  </template>
</template>
