<script setup>
// Imports
import { storeToRefs } from 'pinia'

// Components
import QueueCard from '@/components/QueueCard.vue'

// Stores
import { useQueuesStore } from '@/stores/Queues'

// Queues Store
const queuesStore = useQueuesStore()
queuesStore.hydrate()
await queuesStore.hydrateOnline()
const { sortedQueues, online } = storeToRefs(queuesStore)
</script>

<template>
  <div class="row row-cols-1 row-cols-lg-3 g-4">
    <QueueCard
      v-for="(queue, index) in sortedQueues"
      :key="queue.id"
      :queue="queue"
      :index="index"
      :helpers="online['helpers'][String(queue.id)]"
      :requests="online['requests'][String(queue.id)]"
    >
    </QueueCard>
  </div>
</template>
