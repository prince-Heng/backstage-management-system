import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/category/list',
    method: 'get'
  })
}


export function addribute(catID, attrtype) {
  return request({
    url: '/category/addribute',
    method: 'post',
    data: { catID, attrtype }
  })
}
export function saveProp(data) {
  return request({
    url: '/category/addribute/save',
    method: 'post',
    data
  })
}
export function saveNode(data) {
  return request({
    url: '/category/save',
    method: 'post',
    data
  })
}