<script setup>
// Properties
const props = defineProps({
  request: {
    type: Object,
    default() {
      return {}
    },
  },
  helper: {
    type: Boolean,
    default() {
      return false
    },
  },
})
</script>

<template>
  <li class="list-group-item">
    {{ request.user.name }}
    <template v-if="helper">
      <button class="float-end btn btn-danger btn-sm mx-1">X</button>
      <button class="float-end btn btn-success btn-sm mx-1">Take</button>
    </template>
  </li>
</template>
