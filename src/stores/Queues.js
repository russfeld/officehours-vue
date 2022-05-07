import axios from 'axios'
import { defineStore } from 'pinia'

import { userStore } from '@/stores/User'

export const queueStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
      errors: 0,
    }
  },
  actions: {
    async getQueues() {
      const user = userStore()
      const config = {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + user.token,
        },
      }
      axios
        .get('http://localhost:3000/api/v1/queues', config)
        .then((response) => {
          this.queues = response.data
          this.errors = 0
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            if (this.errors === 0) {
              console.log('Queue get failed - trying token')
              this.errors += 1
              user.tryToken()
              this.getQueues()
            } else {
              console.log(err)
            }
          } else {
            console.log(err)
          }
          this.queues = []
        })
    },
  },
})
