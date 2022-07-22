// Imports
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'
import Logger from 'js-logger'

// Stores
import { useTokenStore } from '@/stores/Token'
import { useQueuesStore } from '@/stores/Queues'

export const useRequestsStore = defineStore('requests', {
  state: () => {
    return {
      requests: [],
      online: [],
      helpers: [],
      socket: undefined,
      connected: false,
      error: false,
    }
  },
  getters: {
    getRequest: (state) => {
      return (id) => state.requests.find((request) => request.user_id === id)
    },
    userOnline: (state) => {
      return (id) =>
        state.online.find((user) => user == id) === undefined ? false : true
    },
    sortedRequests: (state) => {
      return [...state.requests].sort(function (a, b) {
        if (a.status_id == b.status_id) {
          return a.id - b.id
        } else {
          return b.status_id - a.status_id
        }
      })
    },
  },
  actions: {
    async connectQueue(id) {
      if (this.socket) {
        this.socket.disconnect()
      }
      this.$reset()
      const tokenStore = useTokenStore()
      const url = import.meta.env.DEV ? 'http://localhost:3000' : '/'
      this.socket = io(url, {
        auth: {
          token: tokenStore.token,
          queue_id: id,
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
      this.socket.on('queue:update', async (updated) => {
        Logger.info('queue:update - ' + updated.id)
        Logger.debug('|- updated: ' + updated)
        var index = this.requests.findIndex((r) => r.id === updated.id)
        if (index < 0) {
          this.requests.push(updated)
          if (tokenStore.sound) {
            // Sound Credit
            // https://pixabay.com/sound-effects/ding-36029/
            new Audio('/ding-36029.mp3').play()
          }
        } else {
          this.requests[index] = updated
        }
      })
      this.socket.on('queue:remove', async (id) => {
        Logger.info('queue.remove - ' + id)
        var index = this.requests.findIndex((r) => r.id === id)
        if (index >= 0) {
          this.requests.splice(index, 1)
        }
      })
      this.socket.on('user:online', async (id) => {
        Logger.info('user:online - ' + id)
        this.online.push(String(id))
      })
      this.socket.on('user:offline', async (id) => {
        Logger.info('user:offline - ' + id)
        this.online.splice(this.online.indexOf(String(id)), 1)
      })
      this.socket.on('helper:online', async (helper) => {
        Logger.info('helper:online - ' + helper.id)
        Logger.debug('|- helper: ' + helper)
        this.helpers.push(helper)
      })
      this.socket.on('helper:offline', async (id) => {
        Logger.info('helper:offline - ' + id)
        this.helpers.splice(
          this.helpers.findIndex((helper) => helper.id == id),
          1
        )
      })
      this.socket.on('queue:opening', async () => {
        Logger.info('queue:opening')
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      this.socket.on('connected', async (online, helpers) => {
        Logger.info('socket:connected')
        Logger.debug('|-online: ' + online)
        Logger.debug('|-helpers: ' + helpers)
        this.online = online
        this.helpers = helpers
      })
      this.socket.on('queue:closing', async () => {
        Logger.info('queue:closing')
        this.requests = []
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      Logger.info('emit queue:connect')
      await this.socket.emit('queue:connect', async (response, requests) => {
        if (response == 200) {
          Logger.info('queue:connect OK')
          Logger.debug('|- requests: ' + requests)
          this.requests = requests
        } else {
          Logger.error('queue:connect error - ' + response)
        }
      })
    },
    async disconnectQueue() {
      if (this.socket) {
        Logger.info('emit socket:disconnect')
        this.socket.disconnect()
      }
      this.$reset()
    },
    async joinQueue() {
      Logger.info('emit queue:join')
      await this.socket.emit('queue:join', async (response) => {
        if (response == 200) {
          Logger.info('queue:join OK')
        } else {
          Logger.error('queue:join error - ' + response)
        }
      })
    },
    async openQueue() {
      Logger.info('emit queue:open')
      await this.socket.emit('queue:open', async (response) => {
        if (response == 200) {
          Logger.info('queue:open OK')
          const queuesStore = useQueuesStore()
          queuesStore.hydrate()
        } else {
          Logger.error('queue:open error - ' + response)
        }
      })
    },
    async closeQueue() {
      Logger.info('emit queue:close')
      await this.socket.emit('queue:close', async (response) => {
        if (response == 200) {
          Logger.info('queue:close OK')
          this.requests = []
          const queuesStore = useQueuesStore()
          queuesStore.hydrate()
        } else {
          Logger.error('queue:close error - ' + response)
        }
      })
    },
    async takeRequest(id) {
      Logger.info('emit request:take - ' + id)
      await this.socket.emit('request:take', id, async (response) => {
        if (response == 200) {
          Logger.info('request:take OK')
        } else {
          Logger.error('request:take error - ' + response)
        }
      })
    },
    async deleteRequest(id) {
      Logger.info('emit request:delete - ' + id)
      await this.socket.emit('request:delete', id, async (response) => {
        if (response == 200) {
          Logger.info('request:delete OK')
        } else {
          Logger.error('request:delete error - ' + response)
        }
      })
    },
    async finishRequest(id) {
      Logger.info('emit request:finish - ' + id)
      await this.socket.emit('request:finish', id, async (response) => {
        if (response == 200) {
          Logger.info('request:finish OK')
        } else {
          Logger.error('request:finish error - ' + response)
        }
      })
    },
    async requeueRequest(id) {
      Logger.info('emit request:requeue - ' + id)
      await this.socket.emit('request:requeue', id, async (response) => {
        if (response == 200) {
          Logger.info('request:requeue OK')
        } else {
          Logger.error('request:requeue error - ' + response)
        }
      })
    },
  },
})
