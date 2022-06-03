import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const requestsStore = defineStore('requests', {
  state: () => {
    return {
      requests: [],
      socket: undefined,
    }
  },
  actions: {
    async joinQueue(id) {
      if (!this.socket) {
        this.socket = io('http://localhost:3000', {
          auth: {
            token: 'token',
          },
        })
      }
      this.socket.emit('queue:join', id)
    },
  },
})
