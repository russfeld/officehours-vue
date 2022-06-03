import api from '@/services/api'
import { defineStore } from 'pinia'

export const profileStore = defineStore('profile', {
  state: () => {
    return {
      user: {},
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/profile').then((response) => {
        this.user = response.data
      })
    },
    async update(user) {
      await api
        .post('/api/v1/profile/', {
          user: user,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
  },
})
