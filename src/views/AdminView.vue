<script setup>
import { RouterLink } from 'vue-router'
import { usersStore } from '@/stores/Users'
import { queueStore } from '@/stores/Queues'
import { Modal } from 'bootstrap'
import { reactive } from 'vue'

const users = usersStore()
users.hydrate()

const queues = queueStore()
queues.hydrate()

var modalUser = reactive({})
var userModal

const removeUser = function (user) {
  modalUser.id = user.id
  modalUser.eid = user.eid
  modalUser.name = user.name
  userModal = new Modal('#userModal', {})
  userModal.show()
}

const confirmUser = async function (id) {
  await users.deleteUser(id)
  userModal.hide()
}

var modalQueue = reactive({})
var queueModal

const removeQueue = function (queue) {
  modalQueue.id = queue.id
  modalQueue.name = queue.name
  queueModal = new Modal('#queueModal', {})
  queueModal.show()
}

const confirmQueue = async function (id) {
  await queues.deleteQueue(id)
  queueModal.hide()
}

const addQueue = async function () {
  var name = prompt('Enter a name for the new queue')
  try {
    await queues.addQueue(name)
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert(JSON.stringify(error.response.data))
    } else {
      alert(error)
    }
  }
}

const addUser = async function () {
  var eid = prompt('Enter an eID to create a user')
  try {
    await users.addUser(eid)
  } catch (error) {
    if (error.response && error.response.status === 422) {
      alert(JSON.stringify(error.response.data))
    } else {
      alert(error)
    }
  }
}
</script>

<template>
  <div
    id="userModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="userModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="userModalLabel" class="modal-title">Delete User</h5>
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
            @click="confirmUser(modalUser.id)"
          >
            <font-awesome-icon icon="trash" /> Delete User
          </button>
        </div>
      </div>
    </div>
  </div>

  <div
    id="queueModal"
    class="modal fade"
    tabindex="-1"
    aria-labelledby="queueModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 id="queueModalLabel" class="modal-title">Delete Queue</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <h5>Are you sure you want to delete this queue?</h5>
          <p><strong>Name: </strong>{{ modalQueue.name }}</p>
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
            @click="confirmQueue(modalQueue.id)"
          >
            <font-awesome-icon icon="trash" /> Delete Queue
          </button>
        </div>
      </div>
    </div>
  </div>

  <button type="button" class="btn btn-success float-end" @click="addUser">
    <font-awesome-icon icon="plus" /> User
  </button>
  <h1 class="text-center">Users</h1>

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

  <button type="button" class="btn btn-success float-end" @click="addQueue">
    <font-awesome-icon icon="plus" /> Queue
  </button>
  <h1 class="text-center">Queues</h1>
  <table class="table table-striped table-hover">
    <thead>
      <tr>
        <th>Name</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="queue in queues.queues" :key="queue.id">
        <tr>
          <td>{{ queue.name }}</td>
          <td>
            <button
              type="button"
              class="btn btn-danger btn-sm mx-1"
              @click.prevent="removeQueue(queue)"
            >
              <font-awesome-icon icon="trash" />
            </button>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>
