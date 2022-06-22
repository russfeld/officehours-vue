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
    default: -1,
  },
})

// Token Store
const tokenStore = useTokenStore()

// Requests Store
const requestsStore = useRequestsStore()
const { requests } = storeToRefs(requestsStore)
//await requestsStore.joinQueue(props.id)
</script>

<template>
  <ul class="list-group list-group-numbered">
    <RequestItem
      v-for="(request, index) in requests"
      :key="request.id"
      :request="request"
      :index="index"
      v-bind="$attrs"
      :user-id="tokenStore.id"
    >
    </RequestItem>
  </ul>
</template>
