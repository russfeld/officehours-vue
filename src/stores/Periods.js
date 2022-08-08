// Imports
import { defineStore } from 'pinia'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const usePeriodsStore = defineStore('periods', {
  state: () => {
    return {
      queues: [],
      periods: [],
    }
  },
  actions: {
    async hydrate() {
      Logger.info('periods:hydrate')
      await api.get('/api/v1/periods').then((response) => {
        this.queues = response.data
      })
    },
    async loadPeriods(id) {
      Logger.info('periods:hydrate - ' + id)
      await api.get('/api/v1/periods/' + id).then((response) => {
        this.periods = response.data
      })
    },
  },
})
