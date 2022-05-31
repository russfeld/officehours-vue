<script setup>
import { RouterLink } from 'vue-router'
import { usersStore } from '@/stores/Users'
import { Modal } from 'bootstrap'
import { reactive } from 'vue'

const users = usersStore()
users.hydrate()

var modalUser = reactive({})
var modal

const removeUser = function (user) {
  modalUser.id = user.id
  modalUser.eid = user.eid
  modalUser.name = user.name
  modal = new Modal('#myModal', {})
  modal.show()
}

const confirm = async function (id) {
  await users.deleteUser(id)
  modal.hide()
}
</script>

<template>
  <div
    id="myModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="exampleModalLabel" class="modal-title">Delete User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this user?</h5>
          <p>
            <strong>eID: </strong>{{ modalUser.eid }} <br />
            <strong>Name: </strong>{{ modalUser.name }}
          </p>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="confirm(modalUser.id)"
          >
            <font-awesome-icon icon="trash" /> Delete User
          </button>
        </div>
      </div>
    </div>
  </div>
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
            <router-link
              :to="{ name: 'admin_useredit', params: { id: user.id } }"
              class="btn btn-secondary btn-sm mx-1"
            >
              <font-awesome-icon icon="pen-to-square" />
            </router-link>
            <button
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeUser(user)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
