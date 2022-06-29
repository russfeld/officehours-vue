// Imports
import { defineStore } from 'pinia'

// Services
import api from '@/services/api'

export const useQueuesStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
      online: {},
    }
  },
  getters: {
    getQueue: (state) => {
      return (id) => state.queues.find((queue) => queue.id == id)
    },
    sortedQueues: (state) => {
      return [...state.queues].sort((a, b) => b.is_open - a.is_open)
    },
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/queues').then((response) => {
        this.queues = response.data
      })
    },
    async hydrateOnline() {
      await api.get('/api/v1/queues/online').then((response) => {
        this.online = response.data
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
    // async openQueue(id) {
    //   await api.post('/api/v1/queues/' + id + '/open').then(async () => {
    //     await this.hydrate()
    //   })
    // },
  },
})
