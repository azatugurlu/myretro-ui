import request from '@/utils/request'
import oauthRequest from '@/utils/oauthRequest'

export function login(username, password, code) {
  var bodyFormData = new FormData()
  bodyFormData.set('username', username)
  bodyFormData.set('password', password)
  bodyFormData.set('code', code)
  bodyFormData.set('grant_type', 'password')

  return oauthRequest({
    url: '/oauth/token',
    method: 'post',
    data: bodyFormData
  })
}

export function refresh(refreshToken) {
  var bodyFormData = new FormData()
  bodyFormData.set('refresh_token', refreshToken)
  bodyFormData.set('grant_type', 'refresh_token')

  return oauthRequest({
    url: '/oauth/token',
    method: 'post',
    data: bodyFormData
  })
}

export function validateToken(validateObj) {
  return request({
    url: '/api/v1/tfa/validate',
    method: 'post',
    data: validateObj
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
