import api from '@/services/api'
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import { useTokenStore } from '@/stores/Token'

export const useRequestsStore = defineStore('requests', {
  state: () => {
    return {
      requests: [],
      socket: undefined,
      queue_id: -1,
    }
  },
  actions: {
    async hydrate() {
      await api.get('/api/v1/requests/' + this.id).then((response) => {
        this.requests = response.data
      })
    },
    async joinQueue(id) {
      if (id != this.queue_id) {
        if (this.socket) {
          this.socket.disconnect()
          this.socket = undefined
        }
      }
      this.queue_id = id
      if (!this.socket) {
        const tokenStore = useTokenStore()
        if (tokenStore.token) {
          this.socket = io('http://localhost:3000', {
            auth: {
              token: tokenStore.token,
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
