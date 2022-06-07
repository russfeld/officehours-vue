<script setup>
// Properties
const props = defineProps({
  request: {
    type: Object,
    default() {
      return {}
    },
  },
})
</script>

<template>
  <a href="#" class="list-group-item list-group-item-action active">
    {{ request.user_id }}
  </a>
</template>
