import api from '@/services/api'
import { defineStore } from 'pinia'

export const userStore = defineStore('user', {
  state: () => {
    return {
      user: {},
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/user').then((response) => {
        this.user = response.data
      })
    },
    async update(user) {
      await api
        .post('/api/v1/user/', {
          user: user,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
  },
})
