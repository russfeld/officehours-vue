<script setup>
// Imports
import { onMounted, h } from 'vue'
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

const clickFunction = (data) => {
  console.log("Clicked " + data)
}

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
    data: 'queue_name',
    render: function (data) {
      // TODO This doesn't work
      // https://next--vue-dataset-demo.netlify.app/installation/
      return h('button', {
              onClick: () => clickFunction(data)
            }, 'click')
    },
  },
]


</script>

<template>
  <h1 class="display-5 text-center">Event Log: Queues</h1>
  <DataTable
    :columns="columns"
    :data="queues"
    :options="{ paging: false, searching: false, info: false }"
    class="table table-hover table-striped"
    width="100%"
  >
    <thead>
      <tr>
        <th>Name</th>
        <th># Periods</th>
        <th>Recent</th>
        <th>Actions</th>
      </tr>
    </thead>
  </DataTable>
</template>

<style scoped>
@import 'datatables.net-bs5';
</style>
