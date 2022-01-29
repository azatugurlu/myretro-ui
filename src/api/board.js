import request from '@/utils/request'

export function getBoards() {
  return request({
    url: '/api/v1/boards',
    method: 'GET'
  })
}

export function getBoardById(boardId) {
  return request({
    url: '/api/v1/boards/' + boardId,
    method: 'GET'
  })
}

export function createBoard(board) {
  return request({
    url: '/api/v1/boards',
    method: 'POST',
    data: board
  })
}

export function updateBoard(board) {
  return request({
    url: '/api/v1/boards',
    method: 'PUT',
    data: board
  })
}

export function deleteBoard(boardId) {
  return request({
    url: '/api/v1/boards/' + boardId,
    method: 'DELETE'
  })
}

export function createRow(boardRow) {
  return request({
    url: '/api/v1/boards/rows',
    method: 'POST',
    data: boardRow
  })
}

export function deleteRow(rowId) {
  return request({
    url: '/api/v1/boards/rows/' + rowId,
    method: 'DELETE'
  })
}

export function updateRow(boardRow) {
  return request({
    url: '/api/v1/boards/rows',
    method: 'PUT',
    data: boardRow
  })
}

export function createVote(vote) {
  return request({
    url: '/api/v1/boards/rows/votes',
    method: 'POST',
    data: vote
  })
}

export function deleteVote(voteId) {
  return request({
    url: '/api/v1/boards/rows/votes/' + voteId,
    method: 'DELETE'
  })
}