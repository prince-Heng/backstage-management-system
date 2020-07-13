import request from '@/utils/request'

export function list(req) {
  console.log(req)
  return request({
    url: 'sku/list',
    method: 'post',
    data: req
  })
}

export function save(obj) {
  return request({
    url: '/sku/save',
    method: 'post',
    data: obj
  })
}
// 返回值不为0  重复
export function checkcode(skucode) {
  return request({
    url: '/sku/checkcode',
    method: 'post',
    data:{skucode}
  })
}
