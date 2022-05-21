import api from '@/services/api'
import jwt_decode from 'jwt-decode'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const userStore = defineStore('user', {
  state: () => {
    return {
      token: useStorage('token', ''),
    }
  },
  getters: {
    refresh_token() {
      if (this.token) {
        return jwt_decode(this.token)['refresh_token']
      } else {
        return ''
      }
    },
  },
  actions: {
    async getToken() {
      await api
        .get('/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            // Redirect to CAS login
            window.location.href = 'http://localhost:3000/cas_login'
          } else {
            console.error(err)
          }
          this.token = ''
        })
    },

    async tryToken() {
      await api
        .get('/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch(async (err) => {
          if (err.response && err.response.status === 401) {
            // Try refresh token
            await this.refreshToken()
          } else {
            console.error(err)
            this.token = ''
          }
        })
    },

    async refreshToken() {
      await api
        .post('/token', {
          refresh_token: this.refresh_token,
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            console.error('Unable to refresh token - need to log in again')
          } else {
            console.error(err)
          }
          this.token = ''
        })
    },

    async logout() {
      this.token = ''
      window.location.href = 'http://localhost:3000/logout'
    },
  },
})
