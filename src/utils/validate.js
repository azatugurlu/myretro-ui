export function isvalidUsername(str) {
  return str.length > 0
}

export function isValidPassword(password) {
  return password.length > 7
}

export function isValidEmail(email){
  var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
  return (email == "")? false : (reg.test(email)) ? true : false;
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}