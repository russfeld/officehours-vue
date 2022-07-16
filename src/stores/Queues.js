// Imports
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import Logger from 'js-logger'

// Stores
import { useTokenStore } from '@/stores/Token'

// Services
import api from '@/services/api'

export const useQueuesStore = defineStore('queues', {
  state: () => {
    return {
      queues: [],
      online: [],
      socket: undefined,
      connected: false,
      error: false,
    }
  },
  getters: {
    getQueue: (state) => {
      return (id) => state.queues.find((queue) => queue.id == id)
    },
    getOnline: (state) => {
      return (id) => state.online.find((online) => online.id == id)
    },
    sortedQueues: (state) => {
      return [...state.queues].sort((a, b) => b.is_open - a.is_open)
    },
  },
  actions: {
    async hydrate() {
      Logger.info('queues:hydrate')
      await api.get('/api/v1/queues').then((response) => {
        this.queues = response.data
      })
    },
    async hydrateOnline() {
      Logger.info('queues:hydrateOnline')
      if (this.socket) {
        this.socket.disconnect()
        this.online = {}
      }
      const tokenStore = useTokenStore()
      const url = import.meta.env.DEV
        ? 'http://localhost:3000/status'
        : '/status'
      this.socket = io(url, {
        auth: {
          token: tokenStore.token,
        },
      })
      this.socket.on('connect', () => {
        Logger.info('socket:connect')
        this.connected = true
        this.error = false
      })
      this.socket.on('connect_error', (error) => {
        Logger.error('socket:connect_error - ' + error)
        this.$reset
        this.error = true
      })
      this.socket.on('disconnect', () => {
        Logger.info('socket:disconnect')
        this.connected = false
        this.error = false
      })
      Logger.info('emit status:connect')
      await this.socket.emit('status:connect', async (response, online) => {
        if (response == 200) {
          Logger.info('status:connect OK')
          Logger.debug('|- online: ' + online)
          this.online = online
        } else {
          Logger.error('status:connect error - ' + response)
        }
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
  },
})
