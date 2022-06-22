<script setup>
// Stores
import { useRequestsStore } from '@/stores/Requests'

// Properties
const props = defineProps({
  request: {
    type: Object,
    default() {
      return {}
    },
  },
  helper: {
    type: Boolean,
    default() {
      return false
    },
  },
  userId: {
    type: Number,
    default() {
      return -1
    },
  },
})

// Requests Store
const requestsStore = useRequestsStore()

const deleteRequest = async function () {
  await requestsStore.deleteRequest(props.request.id)
}

const takeRequest = async function () {
  await requestsStore.takeRequest(props.request.id)
}

const finishRequest = async function () {
  await requestsStore.finishRequest(props.request.id)
}
</script>

<template>
  <template v-if="request.status_id == 1">
    <li
      class="list-group-item"
      :class="[
        request.user_id == userId ? 'current-user list-group-item-dark' : '',
      ]"
    >
      {{ request.user.name }}
      <template v-if="helper">
        <button
          class="float-end btn btn-danger btn-sm mx-1"
          @click="deleteRequest"
        >
          X
        </button>
        <button
          class="float-end btn btn-primary btn-sm mx-1"
          @click="takeRequest"
        >
          Take
        </button>
      </template>
    </li>
  </template>
  <template v-if="request.status_id == 2">
    <li
      class="list-group-item list-group-item-primary"
      :class="[request.user_id == userId ? 'current-user' : '']"
    >
      {{ request.user.name }}
      <span class="badge bg-primary rounded-pill"
        >Meet with {{ request.helper.name }}</span
      >
      <template v-if="helper">
        <button
          class="float-end btn btn-danger btn-sm mx-1"
          @click="deleteRequest"
        >
          X
        </button>
        <button
          class="float-end btn btn-success btn-sm mx-1"
          @click="finishRequest"
        >
          Done
        </button>
      </template>
    </li>
  </template>
</template>

<style scoped>
.current-user {
  font-weight: bold;
  border-width: 2px;
}
</style>
