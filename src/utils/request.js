import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import store from '../store'
import router from '@/router/index'
import { getToken, setToken } from '@/utils/auth'

// request provider axios
const service = axios.create({
  baseURL: "http://localhost:8083",//process.env.BASE_API, // api base_url
  timeout: 30000 // request timeout
})

// request
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken().accessToken
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// request
service.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.config && error.message != undefined && error.message == "Network Error") {
      return store.dispatch('RefreshToken', getToken().refreshToken).then((token) => {
        error.config.headers['Authorization'] = 'Bearer ' + getToken().accessToken
        return service.request(error.config);
      }, error => {
        //redirect to login............
        router.push({ path: '/login' })
      });
    }

    return Promise.reject(error);

    /*
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
    */
  }
)

export default service

