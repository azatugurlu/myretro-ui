import request from '@/utils/request'

export function getTeams() {
  return request({
    url: '/api/v1/teams',
    method: 'GET'
  })
}

export function createTeam(team) {
  return request({
    url: '/api/v1/teams',
    method: 'POST',
    data: team
  })
}

export function updateTeam(team) {
  return request({
    url: '/api/v1/teams',
    method: 'PUT',
    data: team
  })
}

export function deleteTeam(teamId) {
  return request({
    url: '/api/v1/teams/' + teamId,
    method: 'DELETE'
  })
}