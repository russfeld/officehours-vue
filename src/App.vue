<script setup>
import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from "@/components/HelloWorld.vue";

import { userStore } from '@/stores/User'

const user = userStore()

user.tryToken()
</script>

<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-purple">
      <div class="container">
        <a class="navbar-brand" href="#">Office Hours</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCollapse"
          aria-controls="navbarCollapse"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <RouterLink to="/" active-class="active" class="nav-link"
                >Home</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink to="/about" active-class="active" class="nav-link"
                >About</RouterLink
              >
            </li>
          </ul>
          <div v-if="user.token">
            <a class="btn btn-success" @click="user.logout()"
              ><font-awesome-icon icon="arrow-right-from-bracket" /> Logout</a
            >
          </div>
          <div v-else>
            <a class="btn btn-success" @click="user.getToken()"
              ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
            >
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div id="main" class="container px-4 py-5">
    <div v-if="user.token">
      <RouterView />
    </div>
    <div v-else>
      <a class="btn btn-success" @click="user.getToken()"
        ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
      >
    </div>
  </div>
</template>

<style scoped>
#main {
  margin-top: 20px;
}

.bg-purple {
  background-color: #512888;
}
</style>
