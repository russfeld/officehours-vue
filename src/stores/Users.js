import api from '@/services/api'
import { defineStore } from 'pinia'

export const usersStore = defineStore('users', {
  state: () => {
    return {
      users: [],
    }
  },
  getters: {
    getUserById: (state) => {
      return (id) => state.users.find((user) => user.id === parseInt(id))
    },
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
  },
})
