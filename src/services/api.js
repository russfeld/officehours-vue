/* https://www.bezkoder.com/vue-refresh-token/ */
// Imports
import axios from 'axios'

const instance = axios.create({
  // TODO Configuration URL?
  baseURL: 'http://localhost:3000',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default instance
