<script setup>
// Imports
import { storeToRefs } from 'pinia'
import DataTable from 'datatables.net-vue3'
import DataTableBs5 from 'datatables.net-bs5'
import moment from 'moment'

// Stores
import { usePeriodsStore } from '@/stores/Periods'

// Data Tables Setup
DataTable.use(DataTableBs5)

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.hydrate()
const { queues } = storeToRefs(periodsStore)

const columns = [
  { data: 'queue_name' },
  { data: 'periods' },
  {
    data: 'recent',
    render: function (data) {
      return moment(data).format('L')
    },
  },
  {
    data: null,
    render: function () {
      return '<button class="btn btn-sm btn-primary">Test</button>'
    },
  },
]
</script>

<template>
  <DataTable
    :columns="columns"
    :data="queues"
    class="table table-hover table-striped"
    width="100%"
  >
  </DataTable>
</template>

<style scoped>
@import 'datatables.net-bs5';
</style>
