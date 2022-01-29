import Cookies from 'js-cookie'

const tokenKey = 'form_admin_token'
const refreshTokenKey = 'form_admin_refresh_token'
const expiresInKey = 'form_admin_expires_in'
const is_tfa_enabledKey = 'form_admin_is_tfa_enabled_token'
const is_tfa_verifiedKey = 'form_admin_is_tfa_verified_token'
const phoneNumberKey = 'form_phone_number'

export function getToken() {
  var token = {
    accessToken: '',
    refreshToken: '',
    expiresIn: 0,
    is_tfa_enabled: 'n',
    is_tfa_verified: false
  }

  token.accessToken = Cookies.get(tokenKey)
  token.refreshToken = Cookies.get(refreshTokenKey)
  token.expiresIn = Cookies.get(expiresInKey)
  token.is_tfa_enabled = Cookies.get(is_tfa_enabledKey)
  token.is_tfa_verified = Cookies.get(is_tfa_verifiedKey)

  return token
}

export function setToken(token) {
  Cookies.set(tokenKey, token.accessToken)
  Cookies.set(refreshTokenKey, token.refreshToken)
  Cookies.set(expiresInKey, token.expiresIn)
  Cookies.set(is_tfa_enabledKey, token.is_tfa_enabled)
  Cookies.set(is_tfa_verifiedKey, token.is_tfa_verified)
  return
}

export function removeToken() {
  Cookies.remove(tokenKey)
  Cookies.remove(refreshTokenKey)
  Cookies.remove(expiresInKey)
  Cookies.remove(is_tfa_enabledKey)
  Cookies.remove(is_tfa_verifiedKey)
  return
}

export function savePhone(phone) {
  Cookies.set(phoneNumberKey, phone)
}

export function getPhone() {
  return Cookies.get(phoneNumberKey)
}
