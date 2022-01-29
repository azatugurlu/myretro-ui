import axios from 'axios'
import { Message } from 'element-ui'
import store from '../store'
import i18n from '@/lang/index'
// import store from '../store'

// request provider axios
const service = axios.create({
  baseURL: "http://localhost:8083", // api base_url
  timeout: 15000 // request timeout
})

// request
service.interceptors.request.use(
  config => {
    config.headers['Authorization'] = 'Basic ' + btoa('USER_WEB_APP:VbN2T4cKmH9G')
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
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
    console.log(error);
    Message({
      message: i18n.t('app.sessionExpired'),
      type: 'error',
      duration: 5 * 1000
    })

    store.dispatch('LogOut').then(() => {
      
    }).catch(() => {
      
    })
    
    
    return Promise.reject(error)
  }
)

export default service
