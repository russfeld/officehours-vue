import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QueueView from '../views/QueueView.vue'
import QueueSingleView from '../views/QueueSingleView.vue'
import QueueEditView from '../views/QueueEditView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminView from '../views/AdminView.vue'
import UserEditView from '../views/UserEditView.vue'
import { useTokenStore } from '@/stores/Token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async () => {
        const tokenStore = useTokenStore()

        if (!tokenStore.token) {
          await tokenStore.tryToken()
        }

        if (tokenStore.token) {
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
      props: (route) => {
        return {
          id: Number(route.params.id),
        }
      },
    },
    {
      path: '/queues/:id/edit',
      name: 'queue_edit',
      component: QueueEditView,
      props: true,
      beforeEnter: () => {
        const tokenStore = useTokenStore()
        return tokenStore.is_admin
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
        const tokenStore = useTokenStore()
        return tokenStore.is_admin
      },
    },
    {
      path: '/admin/user/:id/edit',
      name: 'admin_useredit',
      component: UserEditView,
      props: true,
      beforeEnter: () => {
        const tokenStore = useTokenStore()
        return tokenStore.is_admin
      },
    },
  ],
})

router.beforeEach(async function (to) {
  if (to.name !== 'home' && to.name !== 'about') {
    const tokenStore = useTokenStore()

    if (!tokenStore.token) {
      await tokenStore.tryToken()
    }
    if (tokenStore.token) {
      // TODO Remove this?
      // if (app.hydrated === false) {
      //   try {
      //     await queues.hydrate()
      //     app.hydrated = true
      //   } catch (error) {
      //     console.error(error)
      //     return '/'
      //   }
      // }
    } else {
      return '/'
    }
  }
})

export default router
