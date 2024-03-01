<script setup>
// Imports
import { onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'

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
    default: -1
  }
})

// Queues Store
const queuesStore = useQueuesStore()
await queuesStore.hydrate()
const getQueue = queuesStore.getQueue

// Requests Store
const requestsStore = useRequestsStore()
const { connected, error } = storeToRefs(requestsStore)
await requestsStore.connectQueue(props.id)

// Disable Queue
const disableQueue = async function () {
  if (confirm('Are you sure? All pending requests will be lost!')) {
    await requestsStore.closeQueue()
  }
}

// Enable Queue
const enableQueue = async function () {
  await requestsStore.openQueue()
}

// Retry Connect
const reconnect = async function () {
  await requestsStore.connectQueue(props.id)
}

// Disconnect Socket on Leave
onBeforeRouteLeave(async () => {
  await requestsStore.disconnectQueue()
})
</script>

<template>
  <div class="queue-header mx-auto">
    <template v-if="connected">
      <button class="btn btn-outline-success float-end disabled">
        <font-awesome-icon icon="link" />
        <span class="visually-hidden">Connected!</span>
      </button>
    </template>
    <template v-else>
      <template v-if="error">
        <button
          class="btn btn-outline-danger float-end"
          @click="reconnect"
        >
          <font-awesome-icon icon="link-slash" />
          <span class="visually-hidden">Disconnected!</span>
        </button>
      </template>
      <template v-else>
        <button
          class="btn btn-outline-warning float-end"
          @click="reconnect"
        >
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span class="visually-hidden">Connecting...</span>
        </button>
      </template>
    </template>
    <h2 class="text-center">Moderate Queue</h2>
    <template v-if="getQueue(id).is_open == 1">
      <a
        class="w-100 btn btn-success"
        @click="disableQueue"
        >Queue is Open - Click to Close</a
      >
    </template>
    <template v-else>
      <a
        class="w-100 btn btn-danger"
        @click="enableQueue"
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
      <RequestList
        :id="id"
        helper
      />
    </div>
  </div>
</template>

<style scoped>
.queue-header {
  max-width: 500px;
}
</style>
