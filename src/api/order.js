import request from '@/utils/request'
// 更改后台
export function save(obj) {
  return request({
    url: '/order/save',
    method: 'post',
    data: obj
  })
}
// 
export function orderList(data) {
  return request({
    url: '/order/admin/list',
    method: 'post',
    data
  })
}