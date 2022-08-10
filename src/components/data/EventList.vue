<script setup>
// Imports
import { storeToRefs } from 'pinia'
import DataTable from 'datatables.net-vue3'
import DataTableBs5 from 'datatables.net-bs5'
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

// Data Tables Setup
DataTable.use(DataTableBs5)

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadEvents(props.id)
const { events, presences } = storeToRefs(periodsStore)

const columns1 = [
  { data: 'id' },
  { data: 'eid' },
  { data: 'status' },
  //  { data: 'presence_id'},
  {
    data: 'created_at',
    render: function (data) {
      return moment(data).format('L LTS')
    },
  },
  {
    data: 'updated_at',
    render: function (data) {
      return moment(data).format('L LTS')
    },
  },
]

const columns2 = [
  { data: 'id' },
  { data: 'eid' },
  {
    data: 'created_at',
    render: function (data) {
      return moment(data).format('L LTS')
    },
  },
  {
    data: 'updated_at',
    render: function (data) {
      return moment(data).format('L LTS')
    },
  },
]
</script>

<template>
  <h1 class="display-5 text-center">Event Log: Period {{ id }}</h1>
  <h2 class="text-center">Events</h2>
  <DataTable
    :columns="columns1"
    :data="events"
    :options="{ paging: false, searching: false, info: false }"
    class="table table-hover table-striped"
    width="100%"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>eID</th>
        <th>Status</th>
        <th>Start</th>
        <th>End</th>
      </tr>
    </thead>
  </DataTable>
  <h2 class="text-center">Presences</h2>
  <DataTable
    :columns="columns2"
    :data="presences"
    :options="{ paging: false, searching: false, info: false }"
    class="table table-hover table-striped"
    width="100%"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>eID</th>
        <th>Start</th>
        <th>End</th>
      </tr>
    </thead>
  </DataTable>
</template>

<style scoped>
@import 'datatables.net-bs5';
</style>
