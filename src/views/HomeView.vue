<script setup>
// import TheWelcome from "@/components/TheWelcome.vue";
import TopBanner from '@/components/TopBanner.vue'

import { useTokenStore } from '@/stores/Token'

const tokenStore = useTokenStore()
</script>

<template>
  <main>
    <TopBanner />
    <br />
    <div v-if="tokenStore.token">
      <RouterLink to="/queues" class="btn btn-success">Queues List</RouterLink>
    </div>
    <div v-else>
      <a class="btn btn-success" @click="tokenStore.getToken()"
        ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
      >
    </div>
  </main>
</template>
