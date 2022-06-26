<script setup>
// Imports
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

// Components
import QueueCard from '@/components/QueueCard.vue'

// Stores
import { useQueuesStore } from '@/stores/Queues'

// Queues Store
const queuesStore = useQueuesStore()
queuesStore.hydrate()
const { queues } = storeToRefs(queuesStore)

const sortedQueues = computed(() => {
  // HACK - is there a way to do this elsewhere?
  return queues.value.sort((a, b) => b.is_open - a.is_open)
})
</script>

<template>
  <div class="row row-cols-1 row-cols-lg-3 g-4">
    <QueueCard
      v-for="(queue, index) in sortedQueues"
      :key="queue.id"
      :queue="queue"
      :index="index"
    >
    </QueueCard>
  </div>
</template>
