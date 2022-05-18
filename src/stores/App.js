/* Inspired by https://github.com/directus/directus */
import axios from 'axios'
import { defineStore } from 'pinia'

export const appStore = defineStore('app', {
  state: () => {
    return {
      hydrating: false,
      hydrated: false
    }
  }
})