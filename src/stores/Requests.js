// Imports
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

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
      this.socket = io('http://localhost:3000', {
        auth: {
          token: tokenStore.token,
          queue_id: id,
        },
      })
      this.socket.on('connect', () => {
        this.connected = true
        this.error = false
      })
      this.socket.on('connect_error', () => {
        //console.log(error)
        this.$reset
        this.error = true
      })
      this.socket.on('disconnect', () => {
        this.connected = false
        this.error = false
      })
      this.socket.on('queue:update', async (updated) => {
        var index = this.requests.findIndex((r) => r.id === updated.id)
        if (index < 0) {
          this.requests.push(updated)
        } else {
          this.requests[index] = updated
        }
      })
      this.socket.on('queue:remove', async (id) => {
        var index = this.requests.findIndex((r) => r.id === id)
        if (index >= 0) {
          this.requests.splice(index, 1)
        }
      })
      this.socket.on('user:online', async (id) => {
        this.online.push(String(id))
      })
      this.socket.on('user:offline', async (id) => {
        this.online.splice(this.online.indexOf(String(id)), 1)
      })
      this.socket.on('helper:online', async (helper) => {
        this.helpers.push(helper)
      })
      this.socket.on('helper:offline', async (id) => {
        this.helpers.splice(
          this.helpers.findIndex((helper) => helper.id == id),
          1
        )
      })
      this.socket.on('queue:opening', async () => {
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      this.socket.on('connected', async (online, helpers) => {
        this.online = online
        this.helpers = helpers
      })
      this.socket.on('queue:closing', async () => {
        // this.socket.disconnect()
        // this.$reset()
        this.requests = []
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      await this.socket.emit('queue:connect', async (response, requests) => {
        if (response == 200) {
          this.requests = requests
        }
      })
    },
    async disconnectQueue() {
      if (this.socket) {
        this.socket.disconnect()
      }
      this.$reset()
    },
    async joinQueue() {
      await this.socket.emit('queue:join', async (response) => {
        if (response == 200) {
          //await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async openQueue() {
      await this.socket.emit('queue:open', async (response) => {
        if (response == 200) {
          const queuesStore = useQueuesStore()
          queuesStore.hydrate()
        }
      })
    },
    async closeQueue() {
      await this.socket.emit('queue:close', async (response) => {
        if (response == 200) {
          // this.socket.disconnect()
          // this.$reset()
          this.requests = []
          const queuesStore = useQueuesStore()
          queuesStore.hydrate()
        }
      })
    },
    async takeRequest(id) {
      await this.socket.emit('request:take', id, async (response) => {
        if (response == 200) {
          //await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async deleteRequest(id) {
      await this.socket.emit('request:delete', id, async (response) => {
        if (response == 200) {
          //await this.hydrate()
          //TODO handle error?
        }
      })
    },
    async finishRequest(id) {
      await this.socket.emit('request:finish', id, async (response) => {
        if (response == 200) {
          //await this.hydrate()
          //TODO handle error?
        }
      })
    },
  },
})
