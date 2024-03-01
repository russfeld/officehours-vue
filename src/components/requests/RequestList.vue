<script setup>
// Imports
import { storeToRefs } from 'pinia'

// Components
import RequestItem from './RequestItem.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
import { useRequestsStore } from '@/stores/Requests'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1
  },
  helper: {
    type: Boolean,
    default() {
      return false
    }
  }
})

// Token Store
const tokenStore = useTokenStore()

// Requests Store
const requestsStore = useRequestsStore()
const { sortedRequests } = storeToRefs(requestsStore)
//await requestsStore.joinQueue(props.id)
</script>

<template>
  <h3 class="text-center">Students Waiting</h3>
  <hr />
  <ul class="list-group list-group-numbered">
    <RequestItem
      v-for="(request, index) in sortedRequests"
      :key="request.id"
      :request="request"
      :index="index"
      v-bind="$attrs"
      :user-id="tokenStore.id"
      :helper="props.helper"
    >
    </RequestItem>
  </ul>
</template>
