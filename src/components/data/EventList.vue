<script setup>
// Imports
import { storeToRefs } from 'pinia'
import moment from 'moment'

// Stores
import { usePeriodsStore } from '@/stores/Periods'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadEvents(props.id)
const { events, presences, periods } = storeToRefs(periodsStore)
const getPeriod = periodsStore.getPeriod

</script>

<template>
  <h1 class="display-5 text-center">Event Log: Period {{ id }}</h1>
  <h2 class="text-center">Events</h2>
  
  <h2 class="text-center">Presences</h2>
  

  <p>{{ periods }}</p>

  <g-gantt-chart
    chart-start="period.created_at"
    chart-end="period.updated_at"
    precision="hour"
    bar-start="created_at"
    bar-end="updated_at"
  >
    <g-gantt-row
      label="Test"
      :bars="events"
    />

  </g-gantt-chart>
</template>
