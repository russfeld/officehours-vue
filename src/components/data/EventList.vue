<script setup>
// Imports
// Imports
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import {
  Dataset,
  DatasetItem,
  DatasetInfo,
  DatasetPager,
  DatasetSearch,
  DatasetShow
} from 'vue-dataset'

// Stores
import { usePeriodsStore } from '@/stores/Periods'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1
  }
})

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadEvents(props.id)
const { events, presences, getEventsTimline } = storeToRefs(periodsStore)

const eventCols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'eID',
    field: 'eid',
    sort: ''
  },
  {
    name: 'Status',
    field: 'status',
    sort: ''
  },
  {
    name: 'Start',
    field: 'created_at',
    sort: ''
  },
  {
    name: 'End',
    field: 'updated_at',
    sort: ''
  },
  {
    name: 'Helper',
    field: 'presence.eid',
    sort: ''
  }
])

const presenceCols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'eID',
    field: 'eid',
    sort: ''
  },
  {
    name: 'Start',
    field: 'created_at',
    sort: ''
  },
  {
    name: 'End',
    field: 'updated_at',
    sort: ''
  }
])

const eventClick = function (event, i) {
  let toset
  const sortEl = eventCols[i]

  if (!event.shiftKey) {
    this.eventCols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = ''
      }
    })
  }
  if (!sortEl.sort) {
    toset = 'asc'
  }
  if (sortEl.sort === 'desc') {
    toset = event.shiftKey ? '' : 'asc'
  }
  if (sortEl.sort === 'asc') {
    toset = 'desc'
  }
  sortEl.sort = toset
}

const presenceClick = function (event, i) {
  let toset
  const sortEl = presenceCols[i]

  if (!event.shiftKey) {
    this.presenceCols.forEach((o) => {
      if (o.field !== sortEl.field) {
        o.sort = ''
      }
    })
  }
  if (!sortEl.sort) {
    toset = 'asc'
  }
  if (sortEl.sort === 'desc') {
    toset = event.shiftKey ? '' : 'asc'
  }
  if (sortEl.sort === 'asc') {
    toset = 'desc'
  }
  sortEl.sort = toset
}

const eventSortBy = computed(() => {
  return eventCols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === 'asc' ? acc.push(o.field) : acc.push('-' + o.field)
    }

    return acc
  }, [])
})

const presenceSortBy = computed(() => {
  return presenceCols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === 'asc' ? acc.push(o.field) : acc.push('-' + o.field)
    }

    return acc
  }, [])
})

const chartOptions = {
  chart: {
    type: 'rangeBar'
  },
  plotOptions: {
    bar: {
      horizontal: true,
      barHeight: '50%',
      rangeBarGroupRows: true
    }
  },
  xaxis: {
    type: 'datetime',
    labels: {
      datetimeUTC: false
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val, opts) {
      return opts.w.config.series[opts.seriesIndex].data[opts.dataPointIndex].z
    }
  }
}
</script>

<template>
  <h1 class="display-5 text-center">Event Log: Period {{ id }}</h1>
  <h2 class="text-center">Events</h2>

  <div>
    <apexchart
      type="rangeBar"
      :options="chartOptions"
      :series="getEventsTimline"
    ></apexchart>
  </div>

  <dataset
    v-slot="{ ds }"
    :ds-data="events"
    :ds-sortby="eventSortBy"
  >
    <div
      class="row"
      :data-page-count="ds.dsPagecount"
    >
      <div class="col-md-6 mb-2 mb-md-0">
        <dataset-show ds-show-entries="25" />
      </div>
      <div class="col-md-6">
        <dataset-search ds-search-placeholder="Search..." />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="table-responsive">
          <table class="table table-striped d-md-table">
            <thead>
              <tr>
                <th
                  v-for="(th, index) in eventCols"
                  :key="th.field"
                  :class="['sort', th.sort]"
                  @click="eventClick($event, index)"
                >
                  {{ th.name }} <i class="gg-select float-right"></i>
                </th>
              </tr>
            </thead>
            <dataset-item tag="tbody">
              <template #default="{ row }">
                <tr>
                  <td>{{ row.id }}</td>
                  <td>{{ row.eid }}</td>
                  <td>{{ row.status }}</td>
                  <td>{{ row.created_at }}</td>
                  <td>{{ row.updated_at }}</td>
                  <td>{{ row.presence ? row.presence.eid : '' }}</td>
                </tr>
              </template>
            </dataset-item>
          </table>
        </div>
      </div>
    </div>
    <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
      <dataset-info class="mb-2 mb-md-0" />
      <dataset-pager />
    </div>
  </dataset>

  <h2 class="text-center">Presences</h2>

  <dataset
    v-slot="{ ds }"
    :ds-data="presences"
    :ds-sortby="presenceSortBy"
  >
    <div
      class="row"
      :data-page-count="ds.dsPagecount"
    >
      <div class="col-md-6 mb-2 mb-md-0">
        <dataset-show ds-show-entries="25" />
      </div>
      <div class="col-md-6">
        <dataset-search ds-search-placeholder="Search..." />
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="table-responsive">
          <table class="table table-striped d-md-table">
            <thead>
              <tr>
                <th
                  v-for="(th, index) in presenceCols"
                  :key="th.field"
                  :class="['sort', th.sort]"
                  @click="presenceClick($event, index)"
                >
                  {{ th.name }} <i class="gg-select float-right"></i>
                </th>
              </tr>
            </thead>
            <dataset-item tag="tbody">
              <template #default="{ row }">
                <tr>
                  <td>{{ row.id }}</td>
                  <td>{{ row.eid }}</td>
                  <td>{{ row.created_at }}</td>
                  <td>{{ row.updated_at }}</td>
                </tr>
              </template>
            </dataset-item>
          </table>
        </div>
      </div>
    </div>
    <div class="d-flex flex-md-row flex-column justify-content-between align-items-center">
      <dataset-info class="mb-2 mb-md-0" />
      <dataset-pager />
    </div>
  </dataset>
</template>
