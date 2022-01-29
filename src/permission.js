import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false })// NProgress configuration

const whiteList = ['/login', '/register', '/password-reset', '/password-reset-validate', '/register-validate', '/register-success']
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken() !== undefined 
    && getToken().accessToken !== undefined 
    && (getToken().is_tfa_enabled == 'n' 
    || (getToken().is_tfa_enabled == 'y' && getToken().is_tfa_verified))) {
    
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        const jwt = getToken().accessToken
        const jwtData = jwt.split('.')[1]
        const decodedJwtJsonData = window.atob(jwtData)
        const decodedJwtData = JSON.parse(decodedJwtJsonData)

        store.commit('SET_ROLES', decodedJwtData.authorities)
        store.commit('SET_NAME', decodedJwtData.email)
        //store.commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')


        try{
          // generate accessible routes map based on roles
          store.dispatch('permission/generateRoutes', decodedJwtData.authorities).then((accessRoutes) => {
              // dynamically add accessible routes
              router.addRoutes(accessRoutes)

              // hack method to ensure that addRoutes is complete
              // set the replace: true, so the navigation will not leave a history record
              next({ ...to, replace: true })
          })
          
        } catch (error) {
          // remove token and go to login page to re-login
          //store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }

      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
