import axios from 'axios'
import { defineStore } from 'pinia'

export const userStore = defineStore('token', {
  state: () => {
    return {
      token: '',
    }
  },
  actions: {
    async getToken() {
      axios
        .get('http://localhost:3000/token', { withCredentials: true })
        .then((response) => {
          this.token = response.data.token
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            console.log('Redirecting to CAS login')
            window.location.href = 'http://localhost:3000/cas_login'
          } else {
            console.log(err)
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
