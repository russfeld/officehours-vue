<script setup>
import { RouterLink } from 'vue-router'
import { useTokenStore } from '@/stores/Token'
import { useQueuesStore } from '@/stores/Queues'
import { useRequestsStore } from '../stores/Requests'
import RequestItem from '@/components/RequestItem.vue'
import { storeToRefs } from 'pinia'

const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

const tokenStore = useTokenStore()

const queuesStore = useQueuesStore()
await queuesStore.hydrate()

const requestsStore = useRequestsStore()

queuesStore.getQueueById(props.id)
const { queue } = storeToRefs(queuesStore)
const { requests } = storeToRefs(requestsStore)

const toggleQueue = async function (id) {
  await queuesStore.toggleQueue(id)
  queuesStore.getQueueById(props.id)
}

const joinQueue = async function (id) {
  await requestsStore.joinQueue(id)
}
</script>

<template>
  <main>
    <router-link :to="{ name: 'queues' }" class="btn btn-secondary float-start"
      ><font-awesome-icon icon="arrow-left" /> Back</router-link
    >
    <router-link
      v-if="tokenStore.is_admin"
      :to="{ name: 'queue_edit', params: { id: queue.id } }"
      class="btn btn-secondary float-end"
      ><font-awesome-icon icon="pen-to-square" /> Edit</router-link
    >
    <h1 class="display-5 text-center">{{ queue.name }}</h1>
    <hr />
    <div>
      {{ queue.description }}
    </div>
    <hr />
    <div class="d-flex">
      <div class="mx-auto d-block">
        <template v-if="queue.helper == 1">
          <h2 class="text-center">Moderate Queue</h2>
          <template v-if="queue.is_open == 1">
            <a class="w-100 btn btn-danger" @click="toggleQueue(queue.id)"
              >Close Queue</a
            >
            <p>Queue Here!</p>
          </template>
          <template v-else>
            <a class="w-100 btn btn-success" @click="toggleQueue(queue.id)"
              >Open Queue</a
            >
          </template>
        </template>
        <template v-else>
          <h2 class="text-center">Waiting Queue</h2>
          <template v-if="queue.is_open == 1">
            <a class="w-100 btn btn-success" @click="joinQueue(queue.id)"
              >Join Queue</a
            >
            <div class="list-group">
              <RequestItem
                v-for="(request, index) in requests"
                :key="request.id"
                :request="request"
                :index="index"
              >
              </RequestItem>
            </div>
          </template>
          <template v-else>
            <a class="w-100 btn btn-danger" disabled>Queue is Closed</a>
          </template>
        </template>
      </div>
    </div>
  </main>
</template>
