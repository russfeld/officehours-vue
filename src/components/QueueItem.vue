<script setup>
const props = defineProps(['queue'])
</script>

<template>
  <div class="col">
    <div class="card">
      <h5 class="card-header">{{ props.queue.name }}</h5>
      <div class="card-body">
        <!--<h5 class="card-title">Special title treatment</h5>-->
        <p class="card-text">{{ props.queue.description }}</p>
        <a href="#" class="btn btn-primary">Queue</a>
      </div>
    </div>
  </div>
</template>
