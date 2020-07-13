import request from '@/utils/request'

export function list(data) {
  return request({
    url: '/userv2/list',
    method: 'post',
    data
  })
}
export function detail(param) {
  return request({
    url: '/product/detail',
    method: 'post',
    param
  })
}
export function save(obj) {
  return request({
    url: '/user/save',
    method: 'post',
    data: obj
  })
}

export function login(data) {
  return new Promise(resolve => {
    resolve({ data: { token: 'token' }})
  })
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function auth(token) {
  return new Promise(resolve => {
    resolve({ data: { roles: 'admin', name: 'whm', avatar: 'avatar', introduction: 'www' }})
  })

  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
