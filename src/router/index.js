// Imports
import { createRouter, createWebHistory } from 'vue-router'

// Views
import HomeView from '../views/HomeView.vue'
import QueueListView from '../views/QueueListView.vue'
import QueueSingleView from '../views/QueueSingleView.vue'
import QueueEditView from '../views/QueueEditView.vue'
import ProfileView from '../views/ProfileView.vue'
import AdminView from '../views/AdminView.vue'
import UserEditView from '../views/UserEditView.vue'
import DashboardView from '../views/DashboardView.vue'
import PeriodView from '../views/PeriodView.vue'
import EventView from '../views/EventView.vue'

// Stores
import { useTokenStore } from '@/stores/Token'

// Route Guard - Confirm User Is Admin
const requireAdmin = () => {
  const tokenStore = useTokenStore()
  return tokenStore.is_admin
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
      // beforeEnter: async () => {
      //   const tokenStore = useTokenStore()
      //   await tokenStore.tryToken()

      //   if (tokenStore.token) {
      //     return '/queues'
      //   }
      // },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/queues',
      name: 'queues',
      component: QueueListView
    },
    {
      path: '/queues/:id',
      name: 'queue_single',
      component: QueueSingleView,
      props: (route) => {
        return {
          id: Number(route.params.id)
        }
      }
    },
    {
      path: '/queues/:id/edit',
      name: 'queue_edit',
      component: QueueEditView,
      props: true,
      beforeEnter: requireAdmin
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/admin',
      name: 'admin',
      // TODO add code splitting?
      component: AdminView,
      beforeEnter: requireAdmin
    },
    {
      path: '/admin/user/:id/edit',
      name: 'admin_useredit',
      // TODO add code splitting
      component: UserEditView,
      props: true,
      beforeEnter: requireAdmin
    },
    {
      path: '/data',
      name: 'data',
      // TODO add code splitting?
      component: DashboardView,
      beforeEnter: requireAdmin
    },
    {
      path: '/data/:name',
      name: 'data_periods',
      // TODO add code splitting?
      component: PeriodView,
      beforeEnter: requireAdmin,
      props: (route) => {
        return {
          name: route.params.name
        }
      }
    },
    {
      path: '/period/:id',
      name: 'period',
      // TODO add code splitting?
      component: EventView,
      beforeEnter: requireAdmin,
      props: (route) => {
        return {
          id: route.params.id
        }
      }
    }
  ]
})

// Global Route Guard - User Must Log In!
router.beforeEach(async function (to) {
  if (to.name !== 'home' && to.name !== 'about') {
    const tokenStore = useTokenStore()

    if (!tokenStore.token) {
      await tokenStore.getToken()
    }
    if (!tokenStore.token) {
      return '/'
    }
  }
})

export default router
