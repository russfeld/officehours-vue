<script setup>
import { queueStore } from '@/stores/Queues'

const props = defineProps(['id'])
console.log(props.id)

const queues = queueStore()

const queue = queues.getQueueById(props.id)

</script>

<template>
  <main>
    <h1 class="display-5 text-center">{{ queue.name }}</h1>
    <hr>
    <div>
        {{ queue.description }}
    </div>
  </main>
</template>