<script setup>
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
  name: {
    type: String,
    default: ''
  }
})

// Requests Store
const periodsStore = usePeriodsStore()
await periodsStore.loadPeriods(props.name)
const { periods } = storeToRefs(periodsStore)

const cols = reactive([
  {
    name: 'ID',
    field: 'id',
    sort: ''
  },
  {
    name: 'Opened',
    field: 'created_at',
    sort: ''
  },
  {
    name: 'Closed',
    field: 'updated_at',
    sort: ''
  },
  {
    name: 'Events',
    field: 'events',
    sort: ''
  }
])

const click = function (event, i) {
  let toset
  const sortEl = cols[i]

  if (!event.shiftKey) {
    this.cols.forEach((o) => {
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

const sortBy = computed(() => {
  return cols.reduce((acc, o) => {
    if (o.sort) {
      o.sort === 'asc' ? acc.push(o.field) : acc.push('-' + o.field)
    }

    return acc
  }, [])
})
</script>

<template>
  <h1 class="display-5 text-center">Event Log: {{ name }}</h1>

  <dataset
    v-slot="{ ds }"
    :ds-data="periods"
    :ds-sortby="sortBy"
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
                  v-for="(th, index) in cols"
                  :key="th.field"
                  :class="['sort', th.sort]"
                  @click="click($event, index)"
                >
                  {{ th.name }} <i class="gg-select float-right"></i>
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <dataset-item tag="tbody">
              <template #default="{ row }">
                <tr>
                  <td>{{ row.id }}</td>
                  <td>{{ row.created_at }}</td>
                  <td>{{ row.updated_at }}</td>
                  <td>{{ row.events }}</td>
                  <td>
                    <router-link
                      :to="{ name: 'period', params: { id: row.id } }"
                      class="btn btn-secondary btn-sm mx-1"
                      >View</router-link
                    >
                  </td>
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

<style lang="scss">
.gg-select {
  box-sizing: border-box;
  position: relative;
  display: inline;
  transform: scale(1);
  width: 22px;
  height: 22px;
}
.gg-select::after,
.gg-select::before {
  content: '';
  display: block;
  box-sizing: border-box;
  position: absolute;
  width: 8px;
  height: 8px;
  left: 7px;
  transform: rotate(-45deg);
}
.gg-select::before {
  border-left: 2px solid;
  border-bottom: 2px solid;
  bottom: 4px;
  opacity: 0.3;
}
.gg-select::after {
  border-right: 2px solid;
  border-top: 2px solid;
  top: 4px;
  opacity: 0.3;
}
th.sort {
  cursor: pointer;
  user-select: none;
  &.asc {
    .gg-select::after {
      opacity: 1;
    }
  }
  &.desc {
    .gg-select::before {
      opacity: 1;
    }
  }
}

.form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  flex-wrap: nowrap;
}

.mr-1 {
  margin-right: 0.5em;
}

.ml-1 {
  margin-left: 0.5em;
}
</style>
