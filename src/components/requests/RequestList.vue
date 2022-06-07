<script setup>
// Imports
import { storeToRefs } from 'pinia'

// Components
import RequestItem from './RequestItem.vue'

// Stores
import { useRequestsStore } from '@/stores/Requests'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Requests Store
const requestsStore = useRequestsStore()
const { requests } = storeToRefs(requestsStore)
await requestsStore.joinQueue(props.id)
</script>

<template>
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
