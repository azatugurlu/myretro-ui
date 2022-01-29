import request from '@/utils/request'

export function register(user) {
  return request({
    url: '/api/v1/registration/register/public',
    method: 'POST',
    data : user
  })
}
export function emailValidate(validateObj) {
  return request({
    url: '/api/v1/registration/validate-email',
    method: 'POST',
    data : validateObj
  })
}