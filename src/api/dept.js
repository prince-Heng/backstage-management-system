import request from '@/utils/request'

export function list(param) {
  return request({
    url: '/dept/list',
    method: 'post',
    param
  })
}
export function detail(param) {
  return request({
    url: '/dept/detail',
    method: 'post',
    param
  })
}
export function save(param) {
  return request({
    url: '/dept/save',
    method: 'post',
    param
  })
}
