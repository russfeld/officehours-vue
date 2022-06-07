// Imports
import { defineStore } from 'pinia'

// Services
import api from '@/services/api'

export const useRolesStore = defineStore('roles', {
  state: () => {
    return {
      roles: [],
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/roles').then((response) => {
        this.roles = response.data
      })
    },
  },
})
