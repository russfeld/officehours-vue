<script setup>
// Components
import RequestList from './RequestList.vue'

// Stores
import { useQueuesStore } from '@/stores/Queues'
import { useRequestsStore } from '@/stores/Requests'
import { useTokenStore } from '../../stores/Token'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Token Store
const tokenStore = useTokenStore()

// Queues Store
const queuesStore = useQueuesStore()
await queuesStore.hydrate()
const getQueue = queuesStore.getQueue

// Requests Store
const requestsStore = useRequestsStore()

if (getQueue(props.id).is_open == 1) {
  await requestsStore.connectQueue(props.id)
}

// Join Queue
const joinQueue = async function () {
  await requestsStore.joinQueue()
}

var request = requestsStore.requests.find((item) => {
  return item.user_id == tokenStore.id
})

// Subscribe to state
requestsStore.$subscribe((mutation, state) => {
  request = state.requests.find((item) => {
    return item.user_id == tokenStore.id
  })
  // TODO pop up modal if status_id is 2?
})
</script>

<template>
  <h2 class="text-center">Waiting Queue</h2>
  <template v-if="getQueue(id).is_open == 1">
    <template v-if="request != undefined">
      <a class="w-100 btn btn-success disabled" disabled>Queue Joined</a>
    </template>
    <template v-else>
      <a class="w-100 btn btn-success" @click="joinQueue()">Join Queue</a>
    </template>
    <hr />
    <RequestList :id="id" />
  </template>
  <template v-else>
    <a class="w-100 btn btn-danger disabled" disabled>Queue is Closed</a>
  </template>
</template>
