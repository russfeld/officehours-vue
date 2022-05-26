<script setup>
import { RouterLink } from 'vue-router'

import { queueStore } from '@/stores/Queues'

const props = defineProps(['id'])

const queues = queueStore()

const queue = queues.getQueueById(props.id)
</script>

<template>
  <main>
    <router-link :to="{ name: 'queues' }" class="btn btn-secondary float-start"
      ><font-awesome-icon icon="arrow-left" /> Back</router-link
    >
    <router-link
      :to="{ name: 'queue_edit', params: { id: queue.id } }"
      class="btn btn-secondary float-end"
      ><font-awesome-icon icon="pen-to-square" /> Edit</router-link
    >
    <h1 class="display-5 text-center">{{ queue.name }}</h1>
    <hr />
    <div>
      {{ queue.description }}
    </div>
  </main>
</template>
