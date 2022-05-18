<script setup>
// import TheWelcome from "@/components/TheWelcome.vue";
import TopBanner from '@/components/TopBanner.vue'

import { userStore } from '@/stores/User'

const user = userStore()
</script>

<template>
  <main>
    <TopBanner />
    <br />
    <div v-if="user.token">
      <RouterLink to="/queues" class="btn btn-success">Queues List</RouterLink>
    </div>
    <div v-else>
      <a class="btn btn-success" @click="user.getToken()"
        ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
      >
    </div>
  </main>
</template>
