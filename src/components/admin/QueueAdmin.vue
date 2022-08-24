<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { reactive } from 'vue'
import { Modal } from 'bootstrap'

// Stores
import { useQueuesStore } from '@/stores/Queues'

// Queues Store
const queuesStore = useQueuesStore()
queuesStore.hydrate()
const { queues } = storeToRefs(queuesStore)

// Reactive Temp Store
var modalQueue = reactive({})

// Modal Instance
var queueModal

// Show Modal to Remove Queue
const removeQueue = function (queue) {
  modalQueue.id = queue.id
  modalQueue.name = queue.name
  queueModal = new Modal('#queueModal', {})
  queueModal.show()
}

// Confirm Queue Removal
const confirmQueue = async function (id) {
  await queuesStore.deleteQueue(id)
  queueModal.hide()
}

// Add a New Queue
const addQueue = async function () {
  var name = prompt('Enter a name for the new queue')
  if (name) {
    try {
      await queuesStore.addQueue(name)
    } catch (error) {
      if (error.response && error.response.status === 422) {
        alert(JSON.stringify(error.response.data))
      } else {
        alert(error)
      }
    }
  }
}
</script>

<template>
  <div
    id="queueModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="queueModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="queueModalLabel" class="modal-title">Delete Queue</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this queue?</h5>
          <p><strong>Name: </strong>{{ modalQueue.name }}</p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirmQueue(modalQueue.id)"
          >
            <font-awesome-icon icon="trash" /> Delete Queue
          </button>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-success float-end" @click="addQueue">
    <font-awesome-icon icon="plus" /> Queue
  </button>
  <h1 class="text-center">Queues</h1>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="queue in queues" :key="queue.id">
        <tr>
          <td>{{ queue.name }}</td>
          <td>
            <router-link
              :to="{
                name: 'queue_edit',
                params: { id: queue.id, admin: true },
              }"
              class="btn btn-secondary btn-sm mx-1"
              ><font-awesome-icon icon="pen-to-square"
            /></router-link>
            <button
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeQueue(queue)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
