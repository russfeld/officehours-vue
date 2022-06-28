<script setup>
// Imports
import { Modal } from 'bootstrap'
import { onBeforeRouteLeave } from 'vue-router'

// Components
import RequestList from './RequestList.vue'
import HelperList from './HelperList.vue'

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
const getRequest = requestsStore.getRequest
requestsStore.connectQueue(props.id)

// Modal Instance
var studentModal
var modalShown = false

// Subscribe to state
requestsStore.$subscribe(() => {
  const request = getRequest(tokenStore.id)
  if (request && request.status_id == 2 && !modalShown) {
    modalShown = true
    studentModal = new Modal('#studentModal', {})
    studentModal.show()
  }
})

// Join Queue
const joinQueue = async function () {
  modalShown = false
  await requestsStore.joinQueue()
}

// Disconnect Socket on Leave
onBeforeRouteLeave(async () => {
  await requestsStore.disconnectQueue()
})
</script>

<template>
  <div
    id="studentModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="studentModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="studentModalLabel" class="modal-title">Your Turn!</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>
            You will be helped by
            {{
              getRequest(tokenStore.id) && getRequest(tokenStore.id).helper
                ? getRequest(tokenStore.id).helper.name
                : ''
            }}
          </p>
          <p>Their contact info is below</p>
          <div>
            {{
              getRequest(tokenStore.id) && getRequest(tokenStore.id).helper
                ? getRequest(tokenStore.id).helper.contact_info
                : ''
            }}
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="queue-header mx-auto">
    <h2 class="text-center">Waiting Queue</h2>
    <template v-if="getQueue(id).is_open == 1">
      <template v-if="getRequest(tokenStore.id) != undefined">
        <a class="w-100 btn btn-success disabled" disabled>Queue Joined</a>
      </template>
      <template v-else>
        <a class="w-100 btn btn-success" @click="joinQueue()">Join Queue</a>
      </template>
    </template>
    <template v-else>
      <a class="w-100 btn btn-danger disabled" disabled>Queue is Closed</a>
    </template>
  </div>
  <hr />
  <template v-if="getQueue(id).is_open == 1">
    <div class="row">
      <div class="col-12 col-md-4 mb-4">
        <HelperList />
      </div>
      <div class="col-12 col-md-8 mb-4">
        <RequestList :id="id" />
      </div>
    </div>
  </template>
</template>

<style scoped>
.queue-header {
  max-width: 500px;
}
</style>
