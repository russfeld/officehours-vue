import api from '@/services/api'
import { defineStore } from 'pinia'

export const usersStore = defineStore('users', {
  state: () => {
    return {
      users: [],
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/users').then((response) => {
        this.users = response.data
      })
    },
  },
})
