<script setup>
// import TheWelcome from "@/components/TheWelcome.vue";
import TopBanner from '@/components/TopBanner.vue'

import { userStore } from '@/stores/User'

const user = userStore()
</script>

<template>
  <main>
    <TopBanner />

    <div v-if="user.token">Logged In {{ user.token }}</div>
    <div v-else>Not Logged In</div>
  </main>
</template>
