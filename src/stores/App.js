/* Inspired by https://github.com/directus/directus */
import { defineStore } from 'pinia'

export const appStore = defineStore('app', {
  state: () => {
    return {
      hydrated: false,
    }
  },
})
