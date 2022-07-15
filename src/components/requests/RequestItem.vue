<script setup>
// Stores
import { useRequestsStore } from '@/stores/Requests'
import { computed } from 'vue'
import { reactive } from 'vue'
import moment from 'moment'
// import { Tooltip } from 'bootstrap'

// Properties
const props = defineProps({
  request: {
    type: Object,
    default() {
      return {}
    },
  },
  helper: {
    type: Boolean,
    default() {
      return false
    },
  },
  userId: {
    type: Number,
    default() {
      return -1
    },
  },
})

// Format string for dates
// const format = 'M/D/YYYY h:mm:ss A'

// Reactive state for computing times
var state = reactive({ now: moment.utc() })

// Update function for times
const update = function () {
  state.now = moment.utc()
  setInterval(update, 10000)
}

// Call update every 10 seconds
setInterval(update, 10000)

// Requests Store
const requestsStore = useRequestsStore()

const deleteRequest = async function () {
  await requestsStore.deleteRequest(props.request.id)
}

const takeRequest = async function () {
  await requestsStore.takeRequest(props.request.id)
}

const finishRequest = async function () {
  await requestsStore.finishRequest(props.request.id)
}

// Computed value for time ago
const timeAgo = computed(() => {
  if (props.request.updated_at) {
    return state.now.to(props.request.updated_at)
  } else {
    return state.now.to(props.request.created_at)
  }
})

// const tooltipTime = computed(() => {
//   if (props.request.updated_at) {
//     return moment(props.request.updated_at).format(format)
//   } else {
//     return moment(props.request.created_at).format(format)
//   }
// })

// Tooltip Variable
// var tooltip;

// Update on change
// watch(tooltipTime, () => {
//   tooltip.setContent(tooltipTime)
//   console.log("watch")
// })

// Instantiate tooltip
// onMounted(() => {
//   tooltip = new Tooltip('#tooltip')
//   console.log("mount")
// })
</script>

<template>
  <li
    class="list-group-item"
    :class="[
      request.status_id == 2 ? 'list-group-item-primary' : '',
      request.user_id == userId ? 'current-user' : '',
      requestsStore.userOnline(request.user_id) ? '' : 'list-group-item-light',
    ]"
  >
    <template v-if="requestsStore.userOnline(request.user_id)">
      <font-awesome-icon icon="link" />
    </template>
    <template v-else>
      <font-awesome-icon icon="link-slash" />
    </template>
    {{ request.user.name }}
    <template v-if="request.status_id == 2">
      <span class="badge bg-primary rounded-pill">{{
        request.helper.name
      }}</span>
    </template>
    <template v-if="helper">
      <button
        class="float-end btn btn-danger btn-sm mx-1"
        @click="deleteRequest"
      >
        X
      </button>
      <template v-if="request.status_id == 1">
        <button
          class="float-end btn btn-primary btn-sm mx-1"
          @click="takeRequest"
        >
          Take
        </button>
      </template>
      <template v-else>
        <button
          class="float-end btn btn-success btn-sm mx-1"
          @click="finishRequest"
        >
          Done
        </button>
      </template>
      <br />
      <small id="tooltip" class="text-muted">{{ timeAgo }}</small>
    </template>
  </li>
</template>

<style scoped>
.current-user {
  font-weight: bold;
  border-width: 2px;
}

.btn-xs {
  padding: 0.25rem 0.25rem;
  font-size: 0.875rem;
  border-radius: 0.2rem;
  line-height: 1;
}
</style>
