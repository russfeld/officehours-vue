import api from '@/services/api'
import { defineStore } from 'pinia'

export const queueStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
      queue: {},
    }
  },
  // getters: {
  //   getQueueById: (state) => {
  //     return (id) => state.queues.find((queue) => queue.id === parseInt(id))
  //   },
  // },
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
    getQueueById(id) {
      this.queue = this.queues.find((queue) => queue.id === parseInt(id))
    },
  },
})
