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
      events: [],
      presences: [],
    }
  },
  getters: {
    getPeriod: (state) => {
      return (id) => state.periods.find((period) => period.id == id)
    },
  },
  actions: {
    async hydrate() {
      Logger.info('periods:hydrate')
      await api.get('/api/v1/periods').then((response) => {
        this.queues = response.data
      })
    },
    async loadPeriods(name) {
      Logger.info('periods:hydrate - ' + name)
      await api.get('/api/v1/periods?name=' + name).then((response) => {
        this.periods = response.data
      })
    },
    async loadEvents(id) {
      Logger.info('periods:hydrate - ' + id)
      await api.get('/api/v1/periods/' + id).then((response) => {
        this.events = response.data.events
        for (var event of this.events) {
          event.ganttBarConfig = {
            id: event.id
          }
        }
        this.presences = response.data.presences
      })
    },
  },
})
