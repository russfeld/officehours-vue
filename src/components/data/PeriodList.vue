<script setup>
// Imports
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Stores
import { usePeriodsStore } from '@/stores/Periods'

// Properties
const props = defineProps({
  name: {
    type: String,
    default: '',
  },
})

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadPeriods(props.name)
const { periods } = storeToRefs(periodsStore)


</script>

<template>
  <h1 class="display-5 text-center">Event Log: {{ name }}</h1>

  <p>{{ periods }}</p>
</template>