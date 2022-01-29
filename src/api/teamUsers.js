import request from '@/utils/request'

export function getTeamUsers(teamId) {
  return request({
    url: '/api/v1/teams/' + teamId + '/users',
    method: 'GET'
  })
}

export function createTeamUser(teamId, teamUser) {
  return request({
    url: '/api/v1/teams/' + teamId + '/users',
    method: 'POST',
    data: teamUser
  })
}

export function deleteTeamUser(teamId, teamUserId) {
  return request({
    url: '/api/v1/teams/' + teamId + '/users/' +  teamUserId,
    method: 'DELETE'
  })
}