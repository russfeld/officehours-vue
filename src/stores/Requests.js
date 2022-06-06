import api from '@/services/api'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { tokenStore } from '@/stores/Token'

export const requestsStore = defineStore('requests', {
  state: () => {
    return {
      requests: [],
      socket: undefined,
      id: -1
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/requests/' + this.id).then((response) => {
        this.requests = response.data
        console.log("Requests hydrated!")
      })
    },
    async joinQueue(id) {
      if (id != this.id) {
        if (this.socket) {
          this.socket.disconnect()
          this.socket = undefined
        }
      }
      this.id = id
      if (!this.socket) {
        const user = tokenStore()
        if (user.token) {
          this.socket = io('http://localhost:3000', {
            auth: {
              token: user.token,
            },
          })
        }
      }
      await this.socket.emit('queue:join', id, async (response) => {
        if (response != 200) {
          this.socket.disconnect()
          this.socket = undefined
        } else {
          await this.hydrate()
        }
      })
    },
  },
})
