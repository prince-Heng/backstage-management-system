import request from '@/utils/request'

export function list(req) {
    console.log(req)
    return request({
        url: 'merchandise/admin/list',
        method: 'post',
        data: req
    })
}

export function save(obj) {
    return request({
        url: '/merchandise/save',
        method: 'post',
        data: obj
    })
}
export function detial(id) {
    return request({
        url: '/merchandise/detial',
        method: 'post',
        data: { _id: id }
    })
}

export function skulist(productSn, sid) {
    return request({
        url: '/merchandise/skulist',
        method: 'post',
        data: { productSn, sid }
    })
}

// 产品productSn
export function checkSn(productSn) {
    return request({
        url: '/merchandise/checkSn',
        method: 'post',
        data: {productSn}
    })
}