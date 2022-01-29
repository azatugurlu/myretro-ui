import request from '@/utils/request'

export function sendSmsForPhoneNumberValidation() {
  return request({
    url: '/api/v1/validation/sms',
    method: 'POST'
  })
}

export function phoneNumberValidate(validateObj) {
  return request({
    url: '/api/v1/validation/sms/validate',
    method: 'POST',
    data : validateObj
  })
}

export function sendEmailValidation() {
  return request({
    url: '/api/v1/validation/email',
    method: 'POST'
  })
}

export function emailValidate(validateObj) {
  return request({
    url: '/api/v1/validation/email/validate',
    method: 'POST',
    data : validateObj
  })
}