// Imports
import { defineStore } from 'pinia'

// Services
import api from '@/services/api'

export const useUsersStore = defineStore('users', {
  state: () => {
    return {
      users: [],
      user: {},
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/users').then((response) => {
        this.users = response.data
      })
    },
    async update(user) {
      await api
        .post('/api/v1/users/' + user.id, {
          user: user,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
    async deleteUser(id) {
      await api.delete('/api/v1/users/' + id).then(async () => {
        await this.hydrate()
      })
    },
    async addUser(eid) {
      await api.put('/api/v1/users/', { eid: eid }).then(async () => {
        await this.hydrate()
      })
    },
    getUserById(id) {
      this.user = this.users.find((user) => user.id === parseInt(id))
    },
  },
})
