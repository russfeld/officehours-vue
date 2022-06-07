// Imports
import { defineStore } from 'pinia'

// Services
import api from '@/services/api'

export const useQueuesStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
    }
  },
  getters: {
    getQueue: (state) => {
      return (id) => state.queues.find((queue) => queue.id === id)
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
    async deleteQueue(id) {
      await api.delete('/api/v1/queues/' + id).then(async () => {
        await this.hydrate()
      })
    },
    async addQueue(name) {
      await api.put('/api/v1/queues/', { name: name }).then(async () => {
        await this.hydrate()
      })
    },
    async toggleQueue(id) {
      await api.post('/api/v1/queues/' + id + '/toggle').then(async () => {
        await this.hydrate()
      })
    },
  },
})
