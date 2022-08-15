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
  name: {
    type: String,
    default: '',
  },
})

// Data Tables Setup
DataTable.use(DataTableBs5)

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadPeriods(props.name)
const { periods } = storeToRefs(periodsStore)

const columns = [
  { data: 'id' },
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
  { data: 'events' },
  {
    data: 'id',
    render: function (data) {
      return '<a class="btn btn-success" href="/period/' + data + '">View</a>'
    },
  },
]
</script>

<template>
  <h1 class="display-5 text-center">Event Log: {{ name }}</h1>
  <DataTable
    :columns="columns"
    :data="periods"
    class="table table-hover table-striped"
    width="100%"
  >
    <thead>
      <tr>
        <th>ID</th>
        <th>Opened</th>
        <th>Closed</th>
        <th># Events</th>
        <th>Actions</th>
      </tr>
    </thead>
  </DataTable>

  <p>{{ periods }}</p>
</template>

<style scoped>
@import 'datatables.net-bs5';
</style>
