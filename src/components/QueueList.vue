<script setup>
import QueueItem from '@/components/QueueItem.vue'
import { storeToRefs } from 'pinia'

import { useQueuesStore } from '@/stores/Queues'

const queuesStore = useQueuesStore()
queuesStore.hydrate()

const { queues } = storeToRefs(queuesStore)
</script>

<template>
  <div class="row row-cols-1 row-cols-lg-3 g-4">
    <QueueItem
      v-for="(queue, index) in queues"
      :key="queue.id"
      :queue="queue"
      :index="index"
    >
    </QueueItem>
  </div>
</template>
