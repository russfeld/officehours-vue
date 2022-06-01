<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  queue: {
    type: Object,
    default() {
      return {}
    },
  },
})

const router = useRouter()

function loadqueue(queue_id) {
  router.push('/queues/' + queue_id)
}
</script>

<template>
  <div class="col">
    <div class="card w-100 hvr-grow" @click="loadqueue(props.queue.id)">
      <h5 class="card-header">{{ props.queue.name }}</h5>
      <div class="card-body">
        <!--<h5 class="card-title">Special title treatment</h5>-->
        <p class="card-text">{{ props.queue.snippet }}</p>
        <a href="#" class="btn btn-primary">Queue</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Copied from Hover https://github.com/IanLunn/Hover */
/* Grow */
.hvr-grow {
  display: inline-block;
  vertical-align: middle;
  -webkit-transform: perspective(1px) translateZ(0);
  transform: perspective(1px) translateZ(0);
  box-shadow: 0 0 1px rgba(0, 0, 0, 0);
  -webkit-transition-duration: 0.3s;
  transition-duration: 0.3s;
  -webkit-transition-property: transform;
  transition-property: transform;
  cursor: pointer;
}
.hvr-grow:hover,
.hvr-grow:focus,
.hvr-grow:active {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}
</style>
