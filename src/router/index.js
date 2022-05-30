import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QueueView from '../views/QueueView.vue'
import QueueSingleView from '../views/QueueSingleView.vue'
import QueueEditView from '../views/QueueEditView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminView from '../views/AdminView.vue'
import { appStore } from '@/stores/App'
import { tokenStore } from '@/stores/Token'
import { queueStore } from '@/stores/Queues'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async () => {
        const user = tokenStore()

        if (!user.token) {
          await user.tryToken()
        }

        if (user.token) {
          return '/queues'
        }
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/queues',
      name: 'queues',
      component: QueueView,
    },
    {
      path: '/queues/:id',
      name: 'queue_single',
      component: QueueSingleView,
      props: true,
    },
    {
      path: '/queues/:id/edit',
      name: 'queue_edit',
      component: QueueEditView,
      props: true,
      beforeEnter: () => {
        const user = tokenStore()
        return user.is_admin
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: () => {
        const user = tokenStore()
        return user.is_admin
      },
    },
  ],
})

router.beforeEach(async function (to) {
  if (to.name !== 'home' && to.name !== 'about') {
    const app = appStore()
    const user = tokenStore()
    const queues = queueStore()

    if (!user.token) {
      await user.tryToken()
    }
    if (user.token) {
      if (app.hydrated === false) {
        try {
          await queues.hydrate()
          app.hydrated = true
        } catch (error) {
          console.error(error)
          return '/'
        }
      }
    } else {
      return '/'
    }
  }
})

export default router
