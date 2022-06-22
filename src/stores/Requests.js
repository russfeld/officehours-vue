// Imports
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

// Services
import api from '@/services/api'

// Stores
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
      await api.get('/api/v1/requests/' + this.queue_id).then((response) => {
        this.requests = response.data
      })
    },
    async connectQueue(id) {
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
      this.socket.on('queue:update', async () => {
        await this.hydrate()
      })
      this.socket.on('queue:closing', async () => {
        // TODO handle queue closing gracefully
      })
      await this.socket.emit(
        'queue:connect',
        this.queue_id,
        async (response) => {
          if (response != 200) {
            this.socket.disconnect()
            this.socket = undefined
          } else {
            await this.hydrate()
          }
        }
      )
    },
    async joinQueue() {
      await this.socket.emit('queue:join', async (response) => {
        if (response == 200) {
          await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async closeQueue() {
      await this.socket.emit('queue:close', async (response) => {
        if (response == 200) {
          this.socket.disconnect()
          this.socket = undefined
          this.requests = []
        }
      })
    },
    async takeRequest(id) {
      await this.socket.emit('request:take', id, async (response) => {
        if (response == 200) {
          await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async deleteRequest(id) {
      await this.socket.emit('request:delete', id, async (response) => {
        if (response == 200) {
          await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async finishRequest(id) {
      await this.socket.emit('request:finish', id, async (response) => {
        if (response == 200) {
          await this.hydrate()
          //TODO handle error?
        }
      })
    },
  },
})
