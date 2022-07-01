<script setup>
// Imports
import { RouterLink } from 'vue-router'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

// Components
import HelperPane from './requests/HelperPane.vue'
import StudentPane from './requests/StudentPane.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
import { useQueuesStore } from '@/stores/Queues'

// Properties
const props = defineProps({
  id: {
    type: Number,
    default: -1,
  },
})

// Token Store
const tokenStore = useTokenStore()

// Queues Store
const queuesStore = useQueuesStore()
await queuesStore.hydrate()
const getQueue = queuesStore.getQueue
</script>

<template>
  <main>
    <router-link :to="{ name: 'queues' }" class="btn btn-secondary float-start"
      ><font-awesome-icon icon="arrow-left" /> Back</router-link
    >
    <router-link
      v-if="tokenStore.is_admin"
      :to="{ name: 'queue_edit', params: { id: id } }"
      class="btn btn-secondary float-end"
      ><font-awesome-icon icon="pen-to-square" /> Edit</router-link
    >
    <h1 class="display-5 text-center">{{ getQueue(id).name }}</h1>
    <hr />
    <!-- Using DOMPurify to sanitize HTML -->
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-html="DOMPurify.sanitize(marked.parse(getQueue(id).description))"
    ></div>
    <hr />
    <template v-if="getQueue(id).helper == 1">
      <HelperPane :id="id" />
    </template>
    <template v-else>
      <StudentPane :id="id" />
    </template>
  </main>
</template>
