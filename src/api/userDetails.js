import request from '@/utils/request'

export function getUserDetailForLogin(usernameOrPhone) {
  return request({
    url: '/api/v1/users/getInfo/'+ usernameOrPhone,
    method: 'GET'
  })
}

export function getLoginCode(loginRequest) {
  return request({
    url: '/api/v1/login-code',
    method: 'POST',
    data: loginRequest
  })
}

export function getUsers(pageNumber,pageSize,sortByColumnName, filter) {
  pageNumber = pageNumber-1
  return request({
    url: '/api/v1/users?filter='+filter+'&page='+pageNumber+'&size='+pageSize+'&sortBy='+sortByColumnName,
    method: 'GET'
  })
}

export function deleteUser(userId) {
  return request({
    url: '/api/v1/users/' + roleId,
    method: 'DELETE'
  })
}

export function updateUserInformationByUserId(userDto, userId) {
  return request({
    url: '/api/v1/users/' + userId,
    method: 'PUT',
    data: userDto
  })
}

export function getRoles() {
  return request({
    url: '/api/v1/roles',
    method: 'GET'
  })
}

export function createRole(role) {
  return request({
    url: '/api/v1/roles',
    method: 'POST',
    data: role
  })
}

export function updateRole(role) {
  return request({
    url: '/api/v1/roles',
    method: 'PUT',
    data: role
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/api/v1/roles/' + roleId,
    method: 'DELETE'
  })
}

export function getPermissions() {
  return request({
    url: '/api/v1/permissions',
    method: 'GET'
  })
}

export function createPermission(permission) {
  return request({
    url: '/api/v1/permissions',
    method: 'POST',
    data: permission
  })
}

export function updatePermission(permission) {
  return request({
    url: '/api/v1/permissions',
    method: 'PUT',
    data: permission
  })
}

export function deletePermission(permissionId) {
  return request({
    url: '/api/v1/permissions/' + permissionId,
    method: 'DELETE'
  })
}

export function getRolePermissions(roleId) {
  return request({
    url: '/api/v1/roles/' + roleId + '/permissions',
    method: 'GET'
  })
}

export function createRolePermission(roleId, rolePermission) {
  return request({
    url: '/api/v1/roles/' + roleId + '/permissions',
    method: 'POST',
    data: rolePermission
  })
}

export function deleteRolePermission(roleId, rolePermissionId) {
  return request({
    url: '/api/v1/roles/' + roleId + '/permissions/' +  rolePermissionId,
    method: 'DELETE'
  })
}

export function createUserRole(userId, userRole) {
  return request({
    url: '/api/v1/users/' + userId + '/roles',
    method: 'POST',
    data: userRole
  })
}

export function deleteUserRole(userId, userRoleId) {
  return request({
    url: '/api/v1/users/' + userId + '/roles/' +  userRoleId,
    method: 'DELETE'
  })
}

export function updateUserStatus(user) {
  return request({
    url: '/api/v1/users/status',
    method: 'PUT',
    data: user
  })
}

export function resetPassword(resetPass){
  return request({
    url: '/api/v1/password/reset',
    method: 'POST',
    data: resetPass
  })
}


export function validateResetPassword(validateObj){
  return request({
    url: '/api/v1/password/reset/validate',
    method: 'POST',
    data: validateObj
  })
}

export function whoAmI() {
  return request({
    url: '/api/v1/whoAmI',
    method: 'GET'
  })
}

export function getUsersById(id) {
  return request({
    url: '/api/v1/users/admin/'+ id,
    method: 'GET'
  })
}

export function changeUserPassword(passObj){
  return request({
    url: '/api/v1/password/change',
    method: 'POST',
    data: passObj
  })
}
