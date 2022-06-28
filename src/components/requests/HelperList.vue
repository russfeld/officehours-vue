<script setup>
// Imports
import { storeToRefs } from 'pinia'

// Stores
import { useRequestsStore } from '@/stores/Requests'

// Requests Store
const requestsStore = useRequestsStore()
const { helpers } = storeToRefs(requestsStore)
</script>

<template>
  <h3 class="text-center">Helpers Online</h3>
  <hr />
  <ul class="list-group list-group-flush">
    <template v-for="(helper, index) in helpers" :key="index">
      <li class="list-group-item">
        <font-awesome-icon icon="link" /> {{ helper.name }}
      </li>
    </template>
  </ul>
</template>
