/* https://www.bezkoder.com/vue-refresh-token/ */
import axios from "./api";
import { userStore } from '@/stores/User'

const setupInterceptors = () => {
    axios.interceptors.request.use(
        (config) => {
            if (config.url !== "/token") {
              const user = userStore()
              if (user.token) {
                config.headers["Authorization"] = 'Bearer ' + user.token
              }
            }
            return config
        },
        (error) => {
          return Promise.reject(error)
        }
    );
    axios.interceptors.response.use(
      (res) => {
        return res;
      },
      async (err) => {
        const original_config = err.config;
        if (original_config.url !== "/token" && err.response) {
          // Expired Access Token
          if (err.response.status === 401 && !original_config._retry) {
            // Prevent infinite loops
            original_config._retry = true;
            try {
              const user = userStore()
              await user.refreshToken()
              return axios(original_config)
            } catch (_error) {
              return Promise.reject(_error)
            }
          }
        }
        return Promise.reject(err);
      }
    )
}

export default setupInterceptors;