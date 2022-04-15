<script setup>
import { RouterLink, RouterView } from "vue-router";
import HelloWorld from "@/components/HelloWorld.vue";
</script>

<template>
  <header>
    <!-- Fixed navbar -->
    <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-purple">
      <div class="container">
        <a class="navbar-brand" href="#">Office Hours</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav me-auto mb-2 mb-md-0">
            <li class="nav-item">
              <RouterLink to="/" active-class="active" class="nav-link">Home</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/about" active-class="active" class="nav-link">About</RouterLink>
            </li>
          </ul>
          <a class="btn btn-success" href="/logout"><font-awesome-icon icon="arrow-right-to-bracket" /> Logout</a>
        </div>
      </div>
    </nav>
  </header>

  <div class="container">
    <RouterView />
  </div>

</template>

<style>

.bg-purple {
  background-color: #512888;
}

</style>
