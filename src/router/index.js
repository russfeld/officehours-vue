import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import QueueView from '../views/QueueView.vue'
import QueueSingleView from '../views/QueueSingleView.vue'
import { userStore } from '@/stores/User'
import { queueStore } from '@/stores/Queues'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: async (to, from) => {
        const user = userStore()

        if (!user.token) {
          await user.tryToken()
        }
      
        if (user.token) {
          return '/queues'
        }
      }
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
      component: QueueView
    },
    {
      path: '/queues/:id',
      name: 'queue_single',
      component: QueueSingleView,
      props: true,
    }
  ],
})

router.beforeEach(async function(to, from) {
  if(to.name !== 'home') {

    const user = userStore()
    const queues = queueStore()

    if (!user.token) {
      await user.tryToken()
    }

    if (user.token) {
      queues.hydrate()
    } else {
      return '/'
    } 
  }
})

export default router
