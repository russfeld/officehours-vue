<script setup>
// Imports
import { RouterView } from 'vue-router'

// Components
import NavBar from './components/NavBar.vue'

// Stores
import { useTokenStore } from '@/stores/Token'
const tokenStore = useTokenStore()

// Setup Stores
tokenStore.tryToken()
</script>

<template>
  <header>
    <NavBar />
  </header>

  <div
    id="main"
    class="container px-4 py-5"
  >
    <Suspense>
      <RouterView />
    </Suspense>
  </div>
</template>

<style scoped>
#main {
  margin-top: 20px;
}
</style>
