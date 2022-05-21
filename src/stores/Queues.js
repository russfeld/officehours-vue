import api from '@/services/api'
import { defineStore } from 'pinia'

import { userStore } from '@/stores/User'

export const queueStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
      errors: 0,
    }
  },
  getters: {
    getQueueById: (state) => {
      return (id) => state.queues.find((queue) => queue.id === parseInt(id))
    },
  },
  actions: {
    async hydrate() {
      const user = userStore()
      // const config = {
      //   headers: {
      //     Accept: 'application/json',
      //     'Content-Type': 'application/json',
      //     Authorization: 'Bearer ' + user.token,
      //   },
      // }
      await api
        .get('/api/v1/queues')
        .then((response) => {
          this.queues = response.data
          this.errors = 0
        })
        .catch((err) => {
          console.log(err)
        })
    },
  },
})
