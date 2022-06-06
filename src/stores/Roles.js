import api from '@/services/api'
import { defineStore } from 'pinia'

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
