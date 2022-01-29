import { login, refresh, validateToken, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken, savePhone, getPhone } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const user = {
  state: {
    token: getToken().accessToken,
    expiresIn: getToken().expiresIn,
    refreshToken: getToken().refreshToken,
    is_tfa_enabled: getToken().is_tfa_enabled,
    is_tfa_verified: getToken().is_tfa_verified,
    phone: getPhone(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token, expiresIn, refreshToken, is_tfa_enabled, is_tfa_verified) => {
      state.token = token
      var seconds = new Date().getTime() / 1000
      state.expiresIn = seconds + expiresIn
      state.refreshToken = refreshToken
      state.is_tfa_enabled = is_tfa_enabled
      state.is_tfa_verified = is_tfa_verified
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_PHONE: (state, phone) => {
      state.phone = phone
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.code).then(response => {
          var token = {}
          token.accessToken = response.access_token
          token.refreshToken = response.refresh_token
          token.expiresIn = response.expires_in
          token.is_tfa_verified = response.is_tfa_verified
          token.is_tfa_enabled = response.is_tfa_enabled
          setToken(token)
          savePhone(response.phone)
          commit('SET_TOKEN', response.access_token, response.expires_in, response.refresh_token, response.is_tfa_enabled, response.is_tfa_verified)
          commit('SET_PHONE', response.phone)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    RefreshToken({ commit }, refreshToken) {
      return new Promise((resolve, reject) => {
        refresh(refreshToken).then(response => {
          var token = {}
          token.accessToken = response.access_token
          token.refreshToken = response.refresh_token
          token.expiresIn = response.expires_in
          token.is_tfa_verified = response.is_tfa_verified
          token.is_tfa_enabled = response.is_tfa_enabled
          setToken(token)
          savePhone(response.phone)
          commit('SET_TOKEN', response.access_token, response.expires_in, response.refresh_token, response.is_tfa_enabled, response.is_tfa_verified)
          commit('SET_PHONE', response.phone)
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    ValidateToken({ commit }, valdiateObj) {
      return new Promise((resolve, reject) => {
        validateToken(valdiateObj).then(response => {
          resolve()
        }).catch(error => {
          console.log(error)
          reject(error)
        })
      })
    },
    LogOut({ commit, state }) {

      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()
          resolve()
        /*
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
        */
      })
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
