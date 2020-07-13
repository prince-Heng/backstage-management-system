import request from '@/utils/request'
// 订单入库出库
export function receiptSave(obj) {
  return request({
    url: '/warehouse/save',
    method: 'post',
    data: obj
  })
}
// 
export function orderList(data) {
  return request({
    url: '/warehouse/admin/list',
    method: 'post',
    data
  })
}
export function transorder(data) {
  return request({
    url: '/warehouse/transorder',
    method: 'post',
    data
  })
}