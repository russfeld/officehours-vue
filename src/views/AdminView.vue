<script setup>
import { usersStore } from '@/stores/Users'

const users = usersStore()
users.hydrate()
</script>

<template>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>eID</th>
        <th>Name</th>
        <th>Roles</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="user in users.users" :key="user.id">
        <tr>
          <td>{{ user.eid }}</td>
          <td>{{ user.name }}</td>
          <td>
            <span
              v-for="role in user.roles"
              :key="role.id"
              class="badge rounded-pill bg-success"
              >{{ role.name }}</span
            >
          </td>
          <td>
            <button type="button" class="btn btn-secondary btn-sm mx-1">
              <font-awesome-icon icon="pen-to-square" />
            </button>
            <button type="button" class="btn btn-danger btn-sm mx-1">
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
