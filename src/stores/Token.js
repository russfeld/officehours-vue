// Imports
import { defineStore } from 'pinia'
import jwt_decode from 'jwt-decode'
import { useStorage } from '@vueuse/core'
import Logger from 'js-logger'

// Services
import api from '@/services/api'

export const useTokenStore = defineStore('token', {
  state: () => {
    return {
      // HACK this may be unsafe - consider refactor?
      token: useStorage('token', ''),
      sound: true,
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
    eid() {
      if (this.token) {
        return jwt_decode(this.token)['eid']
      } else {
        return ''
      }
    },
    id() {
      if (this.token) {
        return jwt_decode(this.token)['user_id']
      } else {
        return ''
      }
    },
    is_admin() {
      if (this.token) {
        return jwt_decode(this.token)['is_admin']
      } else {
        return false
      }
    },
  },
  actions: {
    async getToken() {
      Logger.info('token:get')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            Logger.info('token:get login failed - redirecting to CAS')
            window.location.href = import.meta.env.DEV
              ? 'http://localhost:3000/auth/login'
              : '/auth/login'
          } else {
            Logger.error('token:get error' + err)
            this.token = ''
          }
        })
    },

    async tryToken() {
      Logger.info('token:try')
      await api
        .get('/auth/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch(async (err) => {
          if (err.response && err.response.status === 401) {
            Logger.info('token:try login failed - trying refresh token')
            await this.refreshToken()
          } else {
            Logger.error('token:try error' + err)
            this.token = ''
          }
        })
    },

    async refreshToken() {
      Logger.info('token:refresh')
      await api
        .post('/auth/token', {
          refresh_token: this.refresh_token,
        })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            Logger.info('token:refresh login failed - redirecting to CAS')
            window.location.href = import.meta.env.DEV
              ? 'http://localhost:3000/auth/login'
              : '/auth/login'
          } else {
            Logger.error('token:refresh error' + err)
            this.token = ''
          }
        })
    },

    async logout() {
      this.token = ''
      window.location.href =
        window.location.href == import.meta.env.DEV
          ? 'http://localhost:3000/auth/logout'
          : '/auth/logout'
    },

    async toggleSound() {
      this.sound = !this.sound
    },
  },
})
