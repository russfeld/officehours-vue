<script setup>
import QueueItem from '@/components/QueueItem.vue'

import { queueStore } from '@/stores/Queues'

const queues = queueStore()

queues.getQueues()
</script>

<template>
  <div class="row row-cols-1 row-cols-md-2 g-4">
    <QueueItem
      v-for="(queue, index) in queues.queues"
      :queue="queue"
      :index="index"
      :key="queue.id"
    >
    </QueueItem>
  </div>
</template>
