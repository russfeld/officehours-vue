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
  <p>Helpers</p>
  {{ helpers }}
</template>