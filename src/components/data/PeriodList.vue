<script setup>
// Imports
import { storeToRefs } from 'pinia'
import DataTable from 'datatables.net-vue3'
import DataTableBs5 from 'datatables.net-bs5'

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
periodsStore.loadPeriods(props.id)
const { periods } = storeToRefs(periodsStore)

const columns = [
  { data: 'queue_name' },
  { data: 'periods' },
  { data: 'recent' },
]
</script>

<template>
  <DataTable
    :columns="columns"
    :data="periods"
    class="table table-hover table-striped"
    width="100%"
  >
  </DataTable>
</template>

<style scoped>
@import 'datatables.net-bs5';
</style>
