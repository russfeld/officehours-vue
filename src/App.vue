<script setup>
import { RouterLink, RouterView } from 'vue-router'

import { tokenStore } from '@/stores/Token'

const user = tokenStore()
</script>

<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-purple">
      <div class="container">
        <RouterLink to="/" class="navbar-brand">Office Hours</RouterLink>
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
        <div id="navbarCollapse" class="collapse navbar-collapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <RouterLink to="/queues" active-class="active" class="nav-link"
                >Queues</RouterLink
              >
            </li>
            <li class="nav-item">
              <RouterLink to="/about" active-class="active" class="nav-link"
                >About</RouterLink
              >
            </li>
          </ul>
          <div class="">
            <div v-if="user.token">
              <ul class="navbar-nav me-auto mb-2 mb-md-0">
                <li class="nav-item">
                  <RouterLink
                    to="/profile"
                    active-class="active"
                    class="nav-link"
                    ><font-awesome-icon icon="user" />
                    {{ user.eid }}</RouterLink
                  >
                </li>
                <li class="nav-item">
                  <a class="btn btn-success float-end" @click="user.logout()"
                    ><font-awesome-icon icon="arrow-right-from-bracket" />
                    Logout</a
                  >
                </li>
              </ul>
            </div>
            <div v-else>
              <a class="btn btn-success" @click="user.getToken()"
                ><font-awesome-icon icon="arrow-right-to-bracket" /> Login</a
              >
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <div id="main" class="container px-4 py-5">
    <Suspense>
      <RouterView />
    </Suspense>
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
