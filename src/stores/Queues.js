import api from '@/services/api'
import { defineStore } from 'pinia'

export const queueStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
    }
  },
  getters: {
    getQueueById: (state) => {
      return (id) => state.queues.find((queue) => queue.id === parseInt(id))
    },
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/queues').then((response) => {
        this.queues = response.data
      })
    },
    async update(queue) {
      await api
        .post('/api/v1/queues/' + queue.id, {
          queue: queue,
        })
        .then(async () => {
          await this.hydrate()
        })
    },
  },
})
