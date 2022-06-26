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
      socket: undefined,
      queue_id: -1,
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
  },
  actions: {
    async connectQueue(id) {
      if (id != this.queue_id) {
        if (this.socket) {
          this.socket.disconnect()
        }
        this.$reset()
      }
      this.queue_id = id
      if (!this.socket) {
        const tokenStore = useTokenStore()
        if (tokenStore.token) {
          this.socket = io('http://localhost:3000', {
            auth: {
              token: tokenStore.token,
              queue_id: this.queue_id,
            },
          })
        }
      }
      this.socket.on('connect_error', async () => {
        //console.log(error)
        // TODO use socket.connected to show connected status in UI?
        this.$reset
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
      this.socket.on('queue:opening', async () => {
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      this.socket.on('connected', async (online) => {
        this.online = online
      })
      this.socket.on('queue:closing', async () => {
        // this.socket.disconnect()
        // this.$reset()
        this.online = []
        this.requests = []
        const queuesStore = useQueuesStore()
        await queuesStore.hydrate()
      })
      await this.socket.emit('queue:connect', async (response, requests) => {
        if (response == 200) {
          // TODO does not deal with sorting yet?
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
          this.online = new Set()
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
